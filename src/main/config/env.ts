export default {
  mongoUrl: process.env.MONGO_URL || 'mongodb://localhost:27017/clean-node-api',
  applicationPort: process.env.PORT || 5050,
  jwtSecret: process.env.JWT_SECRET || 'm<M~VF8>4|~!{gq24S+&2"{5N'
}
