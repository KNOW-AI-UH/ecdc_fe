
from datetime import datetime, timedelta
from dateutil.rrule import rrule, DAILY
import os
import time
from paramiko import SSHClient
import argparse

TODAY = datetime.today()

DEFAULT_USERNAME = os.getlogin()
DEFAULT_KEY_FILENAME = os.path.expanduser('~/.ssh/rsa')

# SRC_HOST = 'svm-90'
DEST_HOST = 'lumi'
SRC = '/cs/puls/Corpus/Medical/{date:%Y/%m/%d}'
DEST = '/scratch/project_462000678/corpus'


def upload_corpus(username, key_filename):
    start_date = TODAY - timedelta(days=2)
    end_date = TODAY - timedelta(days=1)
    for date in rrule(DAILY, dtstart=start_date, until=end_date):
        print(f"Uploading files for date: {date:%Y-%m-%d}")
        src_path = SRC.format(date=date)

        # 找 .paf 文件
        paf_cmd = f"cd {src_path} && find . -type f -name '*.paf' > filelist.txt"
        os.system(paf_cmd)

        account_str = f'-e "ssh -i {key_filename} -o StrictHostKeyChecking=no -l {username}"'
        rsync_cmd = f"rsync -razqO --no-p --files-from={os.path.join(src_path, 'filelist.txt')} {account_str} {src_path}/ {DEST_HOST}:{DEST}"
        os.system(rsync_cmd)
        os.system(f"rsync -razq --exclude='*.*' {src_path}/* {DEST_HOST}:{DEST}")
        
        time.sleep(5)
        
def remove_old_files(username, key_filename):
    command = 'rm -rf {dest}/medisys-*'.format(dest=DEST)
    client = SSHClient()
    client.load_system_host_keys()
    client.connect('lumi.csc.fi', username=username, key_filename=key_filename)
    stdin, stdout, stderr = client.exec_command(command)
    print(stdout.read().decode())
    print(stderr.read().decode())
    client.close()

if __name__ == '__main__':
    parser = argparse.ArgumentParser(description='Upload corpus files from source to destination.')
    parser.add_argument('--timespan', type=int, default=7,
                        help='Number of days to upload files from the past.')
    parser.add_argument('--auto_clean_up', action='store_true',
                        help='Automatically clean up old files after upload.')
    parser.add_argument('--username', type=str, default=DEFAULT_USERNAME,
                        help='Username for SSH connection.')
    parser.add_argument('--key_filename', type=str, default=DEFAULT_KEY_FILENAME,
                        help='Path to the SSH private key file.')
    args = parser.parse_args()
    
    
    
    if args.auto_clean_up:
        remove_old_files(args.username, args.key_filename)
    upload_corpus(args.username, args.key_filename)