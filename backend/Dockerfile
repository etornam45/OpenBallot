FROM oven/bun:latest

# Set environment variable for the database file name
ENV DB_FILE_NAME=file:local.db

COPY . ./

RUN bun install

# Use the --config flag if your config file requires it, or adjust as needed.
RUN bunx drizzle-kit push

EXPOSE 3001
ENTRYPOINT [ "bun", "run", "index.ts" ]
