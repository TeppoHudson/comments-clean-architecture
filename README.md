# comments-clean-architecture
Sample of clean architecture as comments in Javascript. Using node.js and express and MongoDB



#Clean Architecture concept
Functionalities:
- Add comments
- Get comments
- Build in hash-check that comments cannot be dublicated
- Can nest comments if in the API payload the replyToId is defined
- Comments do not have author info (for security), but that can is fetched from another db
- automatically saves source info (IP etc...)


#depency node libraries
express
sanitize-html
ip-regex
crypto

