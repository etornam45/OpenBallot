import { Router, type Request, type Response } from "express";
import { users } from "../db/schema";
import multer from "multer";
import {verify, sign} from "jsonwebtoken"
import { db } from "../db/db";

const auth_router = Router()

const storage = multer.memoryStorage()
const upload = multer({ storage: storage })

auth_router.post("/register", upload.array("images", 10), async (req: Request, res: Response) => {
    const body: {
        name: string;
        voter_id: number;
        images: Express.Multer.File[]
    } = {
        name: req.body.name,
        voter_id: req.body.voter_id,
        images: req.files as Express.Multer.File[]
    };

    if (body.images.length < 2) {
        console.log(body.images)
        res.status(500).send("Please upload more images")
    }
    
    try {
        const average_hash = await GetFacialHash(body.images)
        
        const user = await db.insert(users).values({
            name: body.name, voter_id: body.voter_id,
            facial_hash: average_hash
        }).returning()
        
        res.status(200).json(user)
    } catch (error) {
        console.log(error)
        res.status(500).send("An internal error occured")
    }
});


export async function GetFacialHash(files: Express.Multer.File[]): Promise<string> {
    const FACIAL_API_URL = "http://localhost:3000/average-hash";
    const formData = new FormData();

    files.forEach((file, index) => {
        const blob = new Blob([file.buffer], { type: file.mimetype });
        formData.append("files", blob, `face_${index}.jpg`);
    });

    const response = await fetch(FACIAL_API_URL, {
        method: "POST",
        body: formData
    });

    if (!response.ok) {
        throw new Error("Failed to get facial hash");
    }

    const data = await response.json();
    return data.average_hash;
}

auth_router.post("/login", upload.single("image"), async (req: Request, res: Response) => {
    const body: {
        voter_id: number,
    } = {
        voter_id: Number(req.body.voter_id),
    }

    const user_image = req.file as Express.Multer.File

    const user = await db.query.users.findFirst({
        where: (u, {eq}) => eq(u.voter_id, body.voter_id) 
    })

    try {
        const match = await CheckFaceWithHash(user_image, user?.facial_hash!)
    
        if (!match.is_match) {
            res.status(404).json("Sorry Your image does not match the user")
        }

        const token = sign({id: user?.id}, "JWT_SECRET")

        res.cookie("auth-token", token, {
            // Cookie options here
        })

        res.status(200).json({user, match})
    } catch (error) {
        res.status(500).send("An internal error occured")
    }
})

export async function CheckFaceWithHash(file: Express.Multer.File, hash: string): Promise<{ is_match: boolean, hamming_distance: number }> {
    const FACIAL_API_URL = "http://localhost:3000/compare-hash";
    const formData = new FormData();

    const blob = new Blob([file.buffer], { type: file.mimetype });
    formData.append("file", blob, file.originalname);
    formData.append("target_hash", hash);

    const response = await fetch(FACIAL_API_URL, {
        method: "POST",
        body: formData
    });

    if (!response.ok) {
        throw new Error("Failed to compare facial hash");
    }

    const data = await response.json();
    return {
        is_match: data.is_match,
        hamming_distance: data.hamming_distance
    };
}


export default auth_router