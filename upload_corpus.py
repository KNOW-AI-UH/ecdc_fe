
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
DEST = '/scratch/project_462001042/corpus'


def upload_corpus(username, key_filename):
    start_time = TODAY - timedelta(hours=8)
    end_time = TODAY

    for date in rrule(DAILY, dtstart=start_time.date(), until=end_time.date()):
        print(f"Uploading files for date: {date:%Y-%m-%d}")
        src_path = SRC.format(date=date)
        f1 = open('/home/yiheng/paffilelist.txt', 'w')
        f2 = open('/home/yiheng/filelist.txt', 'w')
        
        if os.path.exists(src_path) is False:
            print(f"Source path does not exist: {src_path}")
            continue
        
        for name in os.listdir(src_path):
            if not name.startswith("medisys-"):
                continue

            # 解析时间戳部分：medisys-YYYYMMDD-HHMMSS
            try:
                ts_str = name.split('-')[1] + name.split('-')[2]  # "20250701" + "001001"
                ts = datetime.strptime(ts_str, "%Y%m%d%H%M%S")
            except Exception as e:
                print(f"Skip invalid folder name: {name}")
                continue
            # 筛选在 8 小时窗口内
            if start_time <= ts <= end_time:
                full_path = os.path.join(src_path, name)

                for root, dirs, files in os.walk(full_path):
                    for file in files:
                        if file.endswith('.paf'):
                            f1.write(f"./{name}/{file}\n")
                        elif ".paf" not in file and not file.startswith("medisys-"):
                            f2.write(f"./{name}/{file}\n")


        account_str = f'-e "ssh -i {key_filename} -o StrictHostKeyChecking=no -l {username}"'
        # 上传paf文件
        rsync_cmd = f"rsync -razqO --no-p --files-from={'/home/yiheng/paffilelist.txt'} {account_str} {src_path}/ {DEST_HOST}:{DEST}"
        os.system(rsync_cmd)
        # 上传没有后缀的文件
        rsync_cmd = f"rsync -razqO --no-p --files-from={'/home/yiheng/filelist.txt'} {account_str} {src_path}/ {DEST_HOST}:{DEST}"
        os.system(rsync_cmd)

        time.sleep(5)
        f1.close()
        f2.close()

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

    remove_old_files(args.username, args.key_filename)
    upload_corpus(args.username, args.key_filename)
