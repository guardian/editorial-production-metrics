#!/usr/bin/env bash
set -e

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

function HELP {
>&2 cat << EOF

  Usage: ${0} -t RDS-HOST

  This script sets up an ssh tunnel from localhost port 5902 to the RDS-HOST provided on port 5432
   using a workflow datastore instance discovered via prism as a bastion host.

    -t RDS-HOST the hostname of the RDS instance e.g. workflow-code.1234abc567.eu-west-1.rds.amazonaws.com

    -h            Displays this help message. No further functions are
                  performed.

EOF
exit 1
}

# Process options
while getopts t:h FLAG; do
  case $FLAG in
    t)
      RDSHOST=$OPTARG
      ;;
    h)  #show help
      HELP
      ;;
  esac
done
shift $((OPTIND-1))

if [ -z "${RDSHOST}" ]; then
    echo "Must specify hostname"
    exit 1
fi


DATASTORE_HOST=$(marauder -s stage=PROD app=editorial-production-metrics --short)
echo $DATASTORE_HOST

ssh -f ubuntu@${DATASTORE_HOST} -L 5901:${RDSHOST}:5432 -N