#!/usr/bin/env bash
#   Use this script to test if a given TCP host/port are available

TIMEOUT=15
QUIET=0
WAITTIME=1
TCP_HOST=localhost
TCP_PORT=

echoerr() { if [[ $QUIET -ne 1 ]]; then echo "$@" 1>&2; fi }

usage()
{
  cat << USAGE >&2
Usage:
  $0 host:port [-t timeout] [-- command args]
  -q | --quiet                        Do not output any status messages
  -t TIMEOUT | --timeout=timeout      Timeout in seconds, zero for no timeout
  -- COMMAND ARGS                     Execute command with args after the test finishes
USAGE
  exit 1
}

wait_for()
{
  if [[ $TIMEOUT -gt 0 ]]; then
    echoerr "$0: waiting $TIMEOUT seconds for $TCP_HOST:$TCP_PORT"
  else
    echoerr "$0: waiting for $TCP_HOST:$TCP_PORT without a timeout"
  fi

  start_ts=$(date +%s)
  while :
  do
    if [[ $ISBUSY -eq 1 ]]; then
      nc -z $TCP_HOST $TCP_PORT
      result=$?
    else
      (echo > /dev/tcp/$TCP_HOST/$TCP_PORT) >/dev/null 2>&1
      result=$?
    fi

    if [[ $result -eq 0 ]]; then
      end_ts=$(date +%s)
      echoerr "$0: $TCP_HOST:$TCP_PORT is available after $((end_ts - start_ts)) seconds"
      break
    fi
    sleep 1
  done
  return $result
}

wait_for "$@"
