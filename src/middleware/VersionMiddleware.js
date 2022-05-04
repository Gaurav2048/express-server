const VersionMiddleWare = (req, res, next) => {
    const url = req.originalUrl;
    if (url.indexOf('v1')) {
        req.type = 'v1';
    } else if (url.indexOf('v2')) {
        req.type = 'v2';
    } else {
        res.send({
            statucCode: 1,
            message: 'Please route to v1 or v2'
        });
        return;
    }
}

module.exports = VersionMiddleWare;
