FROM mctlab/omnizart:latest as builder

FROM tensorflow/tensorflow:2.5.0-gpu
COPY --from=builder /usr/local/lib/python3.6/dist-packages/omnizart ./omnizart
CMD tail -f /dev/null