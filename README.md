# Salt for SHA1 hashes

OpenLDAP style. See http://www.openldap.org/faq/data/cache/347.html

## Installation

    npm install ssha

## Usage

```javascript
assert = require("assert");
ssha = require("ssha");

var hash = ssha.create("secret");
assert(ssha.verify("secret", hash));
```
