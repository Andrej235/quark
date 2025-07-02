#!/bin/bash
npm run dev &
until curl -s http://localhost:1420 > /dev/null; do
  sleep 0.5
done