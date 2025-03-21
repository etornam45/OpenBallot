import { Router, type Request, type Response } from "express";
import { election, pal_candidates, pres_candidates } from "../db/schema";
import { db } from "../db/db";
import { eq } from "drizzle-orm";

const elections_router = Router()


elections_router.get("/election", async (req: Request, res: Response) => {
    const flatResults = await db.select({
        election: election,
        pres_candidates: pres_candidates,
        pal_candidates: pal_candidates
    }).from(election)
      .leftJoin(pres_candidates, eq(election.id, pres_candidates.election_id))
      .leftJoin(pal_candidates, eq(election.id, pal_candidates.election_id));

    const electionsMap = new Map<number, {
        elections: typeof election.$inferInsert,
        pal_candidates: typeof pal_candidates.$inferInsert[],
        pres_candidates: typeof pres_candidates.$inferInsert[]
    }>();

    for (const row of flatResults) {
        const electionId = row.election.id;
        if (!electionsMap.has(electionId)) {
            electionsMap.set(electionId, { elections: row.election, pal_candidates: [], pres_candidates: [] });
        }
        const grouped = electionsMap.get(electionId)!;
        if (row.pal_candidates) {
            grouped.pal_candidates.push(row.pal_candidates);
        }
        if (row.pres_candidates) {
            grouped.pres_candidates.push(row.pres_candidates);
        }
    }

    const elections = Array.from(electionsMap.values());
    console.log(elections);

    res.status(200).json(elections)
})

elections_router.get("/election/:id", async (req: Request, res: Response) => {
    const election_id = +req.params.id
    const results = await db.select({
        elections: election,
        pres_candidates: pres_candidates,
        pal_candidates: pal_candidates
    }).from(election)
      .where(eq(election.id, election_id))
      .fullJoin(pres_candidates, eq(election.id, pres_candidates.election_id))
      .fullJoin(pal_candidates, eq(election.id, pal_candidates.election_id));
    
    const electionBody: ElectionBody = {
        elections: results[0].elections,
        pal_candidates: [],
        pres_candidates: []
    };
    
    for (const row of results) {
        if (row.pal_candidates) {
            electionBody.pal_candidates.push(row.pal_candidates);
        }
        if (row.pres_candidates) {
            electionBody.pres_candidates.push(row.pres_candidates);
        }
    }

    electionBody.pal_candidates = Array.from(new Set(electionBody.pal_candidates)); //to prevent duplicated
    electionBody.pres_candidates = Array.from(new Set(electionBody.pres_candidates)); //to prevent duplicated
    
    const resultsToReturn = electionBody;

    res.status(200).json(resultsToReturn)
})

type Election = typeof election.$inferInsert
type PalCandidates = typeof pal_candidates.$inferInsert
type PresCandidates = typeof pres_candidates.$inferInsert

type ElectionBody = {
    election: Election,
    pal_candidates: PalCandidates[],
    pres_candidates: PresCandidates[]
}

elections_router.post("/election", async (req: Request, res: Response) => {
    const body: ElectionBody = req.body
    console.log(body)

    try {
        db.transaction(async (tx) => {
            const _election = await tx.insert(election).values({ ...body.election, start_time: new Date(body.election.start_time), end_time: new Date(body.election.end_time) }).returning()
            console.log(_election)
            const pres = await tx.insert(pres_candidates).values(body.pres_candidates.map(t => ({ ...t, election_id: _election[0].id }))).returning()
            const pal = await tx.insert(pal_candidates).values(body.pal_candidates.map(t => ({ ...t, election_id: _election[0].id }))).returning()
            console.log({ ...pres, ...pal })
        })

        res.send("Done")
    } catch (error) {
        console.log(error)
    }
})

export default elections_router