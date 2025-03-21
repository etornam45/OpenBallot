FROM oven/bun:latest


COPY . ./

RUN bun install


EXPOSE 5173
ENTRYPOINT [ "bun", "run", "dev", "--" , "--host"]
