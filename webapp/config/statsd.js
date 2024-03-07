import Statsd from "node-statsd";

const statsdClient = new Statsd({
    host: 'localhost',
    port: 8125,
    ipv6: false,
    prefix: "csye6225"
});

export default statsdClient