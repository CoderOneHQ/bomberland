FROM golang:latest as builder

ENV GOPATH=$PWD
ENV CGO_ENABLED=0

COPY . .

RUN go test ./...

RUN go build -o agent

RUN echo "nobody:x:65534:65534:nobody:/:/sbin/nologin" > passwd

FROM scratch

COPY --from=builder /etc/ssl/certs/ca-certificates.crt /etc/ssl/certs/

COPY --from=builder /go/passwd /etc/passwd

COPY --from=builder /go/agent ./agent

USER 65534

ENTRYPOINT [ "/agent" ]
