@echo off
set "GIT=C:\Program Files\Git\cmd\git.exe"
cd /d d:\Portfoliooo

"%GIT%" config user.email "hemantdigarse883@gmail.com"
"%GIT%" config user.name "Hemant Digarse"

"%GIT%" log --oneline >nul 2>&1
if %errorlevel% neq 0 (
    echo Creating initial commits...
    
    "%GIT%" add index.html style.css script.js
    "%GIT%" commit -m "feat: add core portfolio files (HTML, CSS, JS)"

    "%GIT%" add resume.pdf
    "%GIT%" commit -m "docs: add resume PDF"

    "%GIT%" add nptel-cert.jpg nptel-cloud-computing.pdf
    "%GIT%" commit -m "docs: add NPTEL Cloud Computing certificate"

    "%GIT%" add iarneo-cert.jpg iarneo-java.pdf
    "%GIT%" commit -m "docs: add Iamneo Java Programming certificate"

    "%GIT%" add freecodecamp-cert.jpg
    "%GIT%" commit -m "docs: add freeCodeCamp Responsive Web Design certificate"

    "%GIT%" add younid-cert.jpg younid-admission.pdf
    "%GIT%" commit -m "docs: add IIT Madras YouNiD admission certificate"
) else (
    echo Commits exist, adding any untracked/modified files...
    "%GIT%" add -A
    "%GIT%" diff --cached --quiet
    if %errorlevel% neq 0 (
        "%GIT%" commit -m "chore: update portfolio files"
    ) else (
        echo Nothing new to commit.
    )
)

echo ---FINAL LOG---
"%GIT%" log --oneline
echo ---DONE---
