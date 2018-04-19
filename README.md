## Usage

Generate the test file:

Linux
```sh
head -c SIZE /dev/urandom > dummy
```
Windows
```sh
fsutil file createnew dummy SIZE
```

Install `Caddy`:
https://caddyserver.com/

Create `CaddyFile`
```sh
localhost:8080
```

Launch `Caddy`:

```sh
caddy -quic
```

Open your browser and navigate to http://localhost:8080
