from flask import Flask, render_template, request
import os
import time
from detect_image import detect_one_label

# EB looks for an 'application' callable by default.
application = Flask(__name__)


@application.route('/image', methods=['GET', 'POST'])
def upload_file():
    if request.method == 'POST':
        if 'file1' not in request.files:
            return 'there is no file1 in form!'
        file1 = request.files['file1']
        result = detect_one_label(file1)
        return result

        return 'ok'
    return '''
    <h1>Upload new File</h1>
    <form method="post" enctype="multipart/form-data">
      <input type="file" name="file1">
      <input type="submit">
    </form>
    '''


def index():
    return render_template("index.html")


def sayhello(username):
    print(username)
    return render_template("sayhello.html", username=username)


# add a rule for the index page.
application.add_url_rule('/', 'index', index)

# add a rule when the page is accessed with a name appended to the site
# URL.
application.add_url_rule('/<username>', 'hello',
                         (lambda username: sayhello(username)))


# run the app.
if __name__ == "__main__":
    # Setting debug to True enables debug output. This line should be
    # removed before deploying a production app.
    application.debug = True
    application.run()
