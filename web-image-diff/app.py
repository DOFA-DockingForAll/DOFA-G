from flask import Flask, render_template, request

app = Flask(__name__)

@app.route('/')
def image_diff2():
    return render_template('imagediff.html')
    
if __name__ == "__main__":
    app.run(port=8000)
