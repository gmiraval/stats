# stats - API simplificada USD y UVA stats bcra
ToDo: documentar

1)levantamos container redis default
sudo docker run --name redis --restart always -p 6379:6379 -d redis

2)Carga de las tablas redis, via cron:

\# m h  dom mon dow   command<br />
0 22 * * * /home/ubuntu/stats/usdToRedis.py >> ~/cron.log 2>&1<br />
0 23 * * * /home/ubuntu/stats/uvaToRedis.py >> ~/cron.log 2>&1<br />

3)hago build de imagen node-stats

cd nodejs<br />
sudo docker build -t miravallesg/node-stats .<br />

4)lanzo container stats que levanta webserver y consume redis via link

sudo docker create --name stats --restart always -p 8080:8080 --link redis:redisDB miravallesg/node-stat<br />
sudo docker start stats<br />

#ejemplos:<br />
http://gmiraval.dynu.net:8080/usd?inicio=20171201&fin=20180101<br />
http://gmiraval.dynu.net:8080/usd<br />
http://gmiraval.dynu.net:8080/uva?inicio=20171201&fin=20180101<br />
http://gmiraval.dynu.net:8080/uva<br />


