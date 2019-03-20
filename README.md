# Back
[![LoopBack](https://github.com/strongloop/loopback-next/raw/master/docs/site/imgs/branding/Powered-by-LoopBack-Badge-(blue)-@2x.png)](http://loopback.io/)

## Install

Clone the repo

```
git clone https://github.com/mjzuppe/quadrance-api/tree/adfab-develop
```

Your can make your own branch then make PR to `adfab-develop`

`adfab-develop` is the [develop env](https://api.quadrance-develop.fabtesting.com)

`adfab-master` is the [master env](https://api.quadrance.fabtesting.com/)


Install nodes modules dependencies :

```bash
npm i
```

Install a dump from the database to have some users & data

Dump a database:

```
mkdir backup
cd backup
mongodump --db quadrance-db --host localhost --port 27017 --out .
```
Restore a database:

```
# still inside backup directory
cd ../
mongorestore --host localhost --port 27017 --username '' --password '' backup
```
This will look inside backup and the folder name `quadrance-db` will be the name of the restored database used in [the config file](https://github.com/mjzuppe/quadrance-api/blob/adfab-develop/src/datasources/quadrancedb.datasource.json#L9)

## Config

Copy `.env.dist` and rename if `.env` then add your environnement variables

```
# Url => Used by email template to redirect back to the right url
URL=http://localhost:3000
```

## Launch

Prod: Use `npm start` or a custom script with [pm2](http://pm2.keymetrics.io/)

Dev: Use `npm run watch` this will start the server with watch file/reload feature and node inspect feature (to inspect nodeJS server inside chrome devtool)

Then go to [http://localhost:3020/explorer/](http://localhost:3020/explorer/)

---
---

# Front
### [React](https://reactjs.org/) version 16.5.*

## Install

Clone the repo

```
git clone https://github.com/mjzuppe/aubry-beta/tree/adfab-develop
```

Your can make your own branch then make PR to `adfab-develop`

`adfab-develop` is the [develop env](https://quadrance-develop.fabtesting.com)

`adfab-master` is the [master env](https://quadrance.fabtesting.com)

Install nodes modules dependencies :

```bash
npm i
```

## Config

Copy `.env.dist` and rename if `.env` then add your environnement variables

```
# Api url => loopback 4 api
REACT_APP_API_URL=http://127.0.0.1:3020/
# G-suite gmail login api key that match your authorized domain
REACT_APP_GMAIL=96913958633-tim5kv3c10tk0ijo5slk2ahnkufjebuq.apps.googleusercontent.com
```

## Launch

Dev: `npm start`

## Routes

- [login](http://localhost:3000/login)
- [Admin panel](http://localhost:3000/panel)
- [User portal](http://localhost:3000/portal)

