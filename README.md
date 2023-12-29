# to-do-timeline
A to-do-list based on JavaScript, php and a txt-file. <br>
There is no database/SQL integrated. A little helper-tool, mainly for developers.<br>
Yet, tested only with edge-browser.

<br><br><br><br><br>

### Regarding the used applications file- and code-structure,<br>
(my favourite of all times), you can find details<br>
and a template of it on github:<br>
https://github.com/Reinerth/Application-Template-MVC-best-Practice

<br><br><br><br><br>

### Regarding the application:<br>
Ment to be a little helper-tool, <br>
mainly for a developer, because a web-server and php are needed <br>
and the application is not safe enough for a public server.<br>
See limitations below. <br><br>

### Known limitations:<br>
I. SINGLE-USER-application (Details see below) <br>
II. Not working with IIS-server (Details see below)<br>
III. No XSS-catches (Details see below) <br><br>

### Details I:<br>
No database behind, is the reason <br>
why it can only be used by one single user.<br>
If two different users, would make a change on the timeline-file,<br>
they would overwrite each others changes.<br><br>

### Details II:<br>
Not the best technical approach, but<br>
for getting and setting the content to the file,<br>
The POST-Method was used, because GET has limited allowed size. <br>
This is the reason why it is not working on IIS. <br>
Microsofts Server IIS (Internet Information Services) is more strict <br>
and does not accept requesting a file via POST. <br>
HTTPD-server from Apache (e.g. XAMPP) accepts POST to request a file.<br><br>

### Details III:<br>
It would be quite easy to break the tool if trying.<br>
There are no integrated security-features: <br>
- no checks of XSS-injections<br>
- no validity-checks on input-fields<br>
- no lock- or error-catches on the amount of tasks<br>
(I tried 1000 and all went fine - not ment to be for more)

<br><br><br><br><br>

# This is what it looks like:

<br>

### The main view (The red dates are in the future and the gray ones are in the past):<br>
![to-do-timeline-main-view](https://github.com/Reinerth/to-do-timeline/assets/85163640/693c9cd9-f63a-4dfb-80b3-71be43a4db87)

<br>

### Adding a new task:<br>

![to-do-timeline-add-task-view](https://github.com/Reinerth/to-do-timeline/assets/85163640/af73aa83-7928-412e-a68d-4d13b39a44b3)

<br>

### The complete php-code:<br>

![to-do-timeline-the-complete-php-part](https://github.com/Reinerth/to-do-timeline/assets/85163640/e2fe0fb6-c921-4aa1-9b2a-2f729811c95a)

<br>

### All files:<br>

![file-tree](https://github.com/Reinerth/to-do-timeline/assets/85163640/047fce95-ccb7-4f2c-8623-6c793f20c72b)

<br><br><br><br><br><br><br><br><br><br>

