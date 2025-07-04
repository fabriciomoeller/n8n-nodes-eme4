# deploy docker win

create a batch file and run it


## info

``
docker ps
n8n

docker volume ls
self-hosted-ai-starter-kit_n8n_storage
``

```
win_docker_deploy.bat
```



## if you need to delete the folder in docker

# create custom folder

```
docker exec -it --user root n8n /bin/sh

cd /home/node/.n8n/
ls -la
mkdir custom
cd custom
ls -la
rm -rf n8n-nodes-b24-custom-nodes/ 
ls -la
exit
```



