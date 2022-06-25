function basicAuth (req, res, next) {
    var authHearder = req.headers.authorization;
    console.log("authHearder11111", authHearder);
    if (!authHearder) {
        var err = new Error("You are not authenticated!");
        res.setHeader('WWW-Authenticate', 'Basic');
        err.status = 401;
          return next(err);
    }
    var auth = new Buffer(authHearder.split(' ')[1], 'base64').toString().split(':');
    var userName = auth[0];
    var password = auth[1];
    if (userName === "Book" && password === "Book@123") {
        console.log("YES");
        next();
    }
    else {
        var err = new Error("You are not authenticated!");
        res.setHeader('WWW-Authenticate', 'Basic');
        err.status = 401;
        err.message = "You are not authenticated!"
        return next(err);
    }
}