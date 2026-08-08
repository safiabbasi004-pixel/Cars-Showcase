/* =========================================================
   SAFI COURSES — main script
   ========================================================= */

/* ---------------- Loader + AOS ---------------- */
window.addEventListener('load', function () {
  var loader = document.querySelector('.loader');
  document.body.classList.add('is-ready');
  if (loader) {
    loader.addEventListener('transitionend', function () {
      loader.style.display = 'none';
    }, { once: true });
  }
  if (window.AOS) AOS.init({ once: true, duration: 700 });
});

/* ---------------- Motion helpers ---------------- */
document.addEventListener('DOMContentLoaded', function () {
  var progress = document.createElement('div');
  progress.className = 'scroll-progress';
  progress.setAttribute('aria-hidden', 'true');
  document.body.appendChild(progress);

  function updateScrollProgress() {
    var scrollable = document.documentElement.scrollHeight - window.innerHeight;
    var percent = scrollable > 0 ? (window.scrollY / scrollable) * 100 : 0;
    progress.style.width = percent + '%';
  }
  window.addEventListener('scroll', updateScrollProgress, { passive: true });
  updateScrollProgress();

  var revealItems = document.querySelectorAll('.course-card, .category, .featured-image-section img, footer');
  revealItems.forEach(function (item, index) {
    item.classList.add('reveal-on-scroll');
    item.style.transitionDelay = Math.min(index * 45, 240) + 'ms';
  });
  if ('IntersectionObserver' in window) {
    var revealObserver = new IntersectionObserver(function (entries, observer) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      });
    }, { threshold: 0.12 });
    revealItems.forEach(function (item) { revealObserver.observe(item); });
  } else {
    revealItems.forEach(function (item) { item.classList.add('is-visible'); });
  }

  document.querySelectorAll('button, .hero-btns a, .signup').forEach(function (button) {
    button.classList.add('ripple-button');
    button.addEventListener('click', function (event) {
      var ripple = document.createElement('span');
      var rect = button.getBoundingClientRect();
      ripple.className = 'ripple';
      ripple.style.left = (event.clientX - rect.left) + 'px';
      ripple.style.top = (event.clientY - rect.top) + 'px';
      button.appendChild(ripple);
      ripple.addEventListener('animationend', function () { ripple.remove(); }, { once: true });
    });
  });

  var hero = document.querySelector('.hero');
  var heroCard = document.querySelector('.hero-card .glass-card');
  if (hero && heroCard && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    hero.addEventListener('pointermove', function (event) {
      var bounds = hero.getBoundingClientRect();
      var x = (event.clientX - bounds.left) / bounds.width - 0.5;
      var y = (event.clientY - bounds.top) / bounds.height - 0.5;
      heroCard.style.transform = 'translate(' + (x * 8) + 'px,' + (y * 8) + 'px)';
    });
    hero.addEventListener('pointerleave', function () { heroCard.style.transform = ''; });
  }
});

/* ---------------- Theme toggle ---------------- */
(function themeInit() {
  var root = document.documentElement;
  var saved = localStorage.getItem('safi_theme');
  if (saved) root.setAttribute('data-theme', saved);

  document.addEventListener('DOMContentLoaded', function () {
    var btn = document.getElementById('theme-btn');
    if (!btn) return;
    updateThemeIcon();
    btn.addEventListener('click', function () {
      var current = root.getAttribute('data-theme') === 'dark' ? 'dark' : 'light';
      var next = current === 'dark' ? 'light' : 'dark';
      root.setAttribute('data-theme', next);
      localStorage.setItem('safi_theme', next);
      updateThemeIcon();
    });
    function updateThemeIcon() {
      var isDark = root.getAttribute('data-theme') === 'dark';
      btn.innerHTML = '<i class="fa-solid fa-' + (isDark ? 'sun' : 'moon') + '"></i>';
    }
  });
})();

/* ---------------- Mobile nav ---------------- */
document.addEventListener('DOMContentLoaded', function () {
  var toggle = document.getElementById('nav-toggle');
  var links = document.querySelector('.nav-links');
  if (toggle && links) {
    toggle.addEventListener('click', function () {
      links.classList.toggle('active');
    });
    links.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', function () { links.classList.remove('active'); });
    });
  }

  var categoryMap = {
    programming: 'python',
    design: 'css',
    business: 'business',
    ai: 'ai'
  };

  document.querySelectorAll('.category').forEach(function (category) {
    function openCategoryCourse() {
      var key = category.dataset.category;
      var courseId = categoryMap[key] || 'webdev';
      openCourse(courseId);
    }

    category.addEventListener('click', openCategoryCourse);
    category.addEventListener('keydown', function (event) {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        openCategoryCourse();
      }
    });
  });

  // Smooth-scroll every "Explore Courses" / stray hero button to #courses
  document.querySelectorAll('.explore-btn, .hero-btns .primary').forEach(function (btn) {
    btn.addEventListener('click', function (e) {
      e.preventDefault();
      var target = document.getElementById('courses');
      if (target) target.scrollIntoView({ behavior: 'smooth' });
    });
  });
});

/* =========================================================
   COURSE DATA
   ========================================================= */
var COURSES = {
  html: {
    title: 'HTML5 Fundamentals',
    icon: 'fa-html5',
    duration: '4 Weeks',
    level: 'Beginner',
    type: 'web',
    lessons: [
      { title: '1. Document Structure', body: 'Every page starts with <code>&lt;!DOCTYPE html&gt;</code>, a <code>&lt;head&gt;</code> for metadata, and a <code>&lt;body&gt;</code> for visible content. Browsers read top to bottom, so structure matters.' },
      { title: '2. Semantic Tags', body: 'Use <code>&lt;header&gt;</code>, <code>&lt;nav&gt;</code>, <code>&lt;main&gt;</code>, <code>&lt;section&gt;</code> and <code>&lt;footer&gt;</code> instead of endless <code>&lt;div&gt;</code>s — it helps screen readers and search engines understand your page.' },
      { title: '3. Forms & Inputs', body: 'Forms collect data with <code>&lt;input&gt;</code>, <code>&lt;select&gt;</code> and <code>&lt;textarea&gt;</code>. Always pair an input with a <code>&lt;label&gt;</code> for accessibility.' }
    ],
    starter: { html: '<h1>Hello, Safi Coder!</h1>\n<p>Edit this HTML and hit Run.</p>', css: 'h1{ color:#4f46e5; font-family:sans-serif; }', js: '' },
    quiz: [
      { q: 'Which tag holds the visible content of a page?', options: ['<head>', '<body>', '<meta>', '<html>'], answer: 1 },
      { q: 'Which tag is used for the main navigation menu?', options: ['<nav>', '<menu-main>', '<links>', '<navbar>'], answer: 0 },
      { q: 'What does semantic HTML improve?', options: ['File size only', 'Accessibility & SEO', 'CSS colors', 'Nothing'], answer: 1 },
      { q: 'Which attribute links a <label> to an input?', options: ['name', 'for', 'link', 'ref'], answer: 1 }
    ]
  },
  css: {
    title: 'CSS3 & Responsive Design',
    icon: 'fa-css3-alt',
    duration: '5 Weeks',
    level: 'Beginner to Intermediate',
    type: 'web',
    lessons: [
      { title: '1. The Box Model', body: 'Every element is a box made of <code>content</code>, <code>padding</code>, <code>border</code> and <code>margin</code>. Understanding this stops 90% of layout bugs.' },
      { title: '2. Flexbox', body: '<code>display:flex</code> turns a container into a flexible row or column — perfect for centering things and building navbars.' },
      { title: '3. Media Queries', body: '<code>@media (max-width:600px){...}</code> lets your design adapt to phones, tablets and desktops from one stylesheet.' }
    ],
    starter: { html: '<div class="box">Resize me</div>', css: '.box{\n  padding:20px;\n  background:#12b3a0;\n  color:#fff;\n  border-radius:10px;\n  text-align:center;\n}', js: '' },
    quiz: [
      { q: 'Which CSS property adds space inside an element\'s border?', options: ['margin', 'padding', 'gap', 'inset'], answer: 1 },
      { q: 'Which display value creates a flexible row/column layout?', options: ['flex', 'block', 'inline', 'grid-row'], answer: 0 },
      { q: 'Media queries are mainly used for...', options: ['Animations', 'Responsive design', 'Fonts only', 'Database styling'], answer: 1 },
      { q: 'Which order is correct for the box model (outside-in)?', options: ['margin, border, padding, content', 'content, margin, border, padding', 'border, content, margin, padding', 'padding, margin, content, border'], answer: 0 }
    ]
  },
  business: {
    title: 'Business & Digital Growth',
    icon: 'fa-chart-line',
    duration: '6 Weeks',
    level: 'Beginner',
    type: 'web',
    lessons: [
      { title: '1. Value Proposition', body: 'A strong business starts with a clear promise: what problem do you solve, for whom, and why is your solution better?' },
      { title: '2. Customer Research', body: 'Study customer pain points, buying habits, and competition before creating products, pricing, or campaigns.' },
      { title: '3. Marketing Funnels', body: 'Use awareness, interest, action, and retention to turn strangers into customers and loyal advocates.' }
    ],
    starter: {
      html: '<div class="biz-card">\n  <h2>Launch Plan</h2>\n  <p>Turn ideas into product momentum.</p>\n  <button id="planBtn">View Growth Strategy</button>\n</div>',
      css: '.biz-card{max-width:320px;margin:24px auto;padding:20px;border-radius:14px;background:linear-gradient(135deg,#eef2ff,#ecfeff);font-family:sans-serif;text-align:center;border:1px solid #c7d2fe;}\nbutton{padding:10px 18px;border:none;border-radius:999px;background:#4f46e5;color:#fff;cursor:pointer;}',
      js: 'document.getElementById("planBtn").addEventListener("click", function(){\n  alert("Focus on product value, customer trust, and repeat sales.");\n});'
    },
    quiz: [
      { q: 'A value proposition explains...', options: ['How a business makes money', 'The problem solved and benefit offered', 'Only the logo design', 'The website domain'], answer: 1 },
      { q: 'Which stage comes after awareness in a sales funnel?', options: ['Retention', 'Interest', 'Shipping', 'Coding'], answer: 1 },
      { q: 'Customer research helps you understand...', options: ['Only CSS colors', 'Pain points and buying behavior', 'Browser versions only', 'The file naming'], answer: 1 },
      { q: 'Which factor is important for business growth?', options: ['Clear product value', 'Random guessing', 'Ignoring feedback', 'No strategy'], answer: 0 }
    ]
  },
  javascript: {
    title: 'JavaScript Essentials',
    icon: 'fa-js',
    duration: '6 Weeks',
    level: 'Beginner to Intermediate',
    type: 'web',
    lessons: [
      { title: '1. Variables & Types', body: 'Use <code>let</code> and <code>const</code> to store data. JavaScript has strings, numbers, booleans, arrays and objects.' },
      { title: '2. Functions', body: 'Functions bundle reusable logic: <code>function greet(name){ return "Hi " + name; }</code>.' },
      { title: '3. DOM Manipulation', body: '<code>document.querySelector()</code> grabs elements, and you can change their text, style, or listen for clicks with <code>addEventListener</code>.' }
    ],
    starter: { html: '<button id="btn">Click me</button>\n<p id="out">Waiting...</p>', css: 'button{padding:8px 16px;border-radius:8px;border:none;background:#4f46e5;color:#fff;}', js: 'document.getElementById("btn").addEventListener("click", function(){\n  document.getElementById("out").textContent = "Button was clicked!";\n});' },
    quiz: [
      { q: 'Which keyword declares a variable that can\'t be reassigned?', options: ['var', 'let', 'const', 'static'], answer: 2 },
      { q: 'Which method selects a single element by CSS selector?', options: ['getElementById()', 'querySelector()', 'select()', 'findElement()'], answer: 1 },
      { q: 'How do you listen for a click event?', options: ['el.onLoad()', 'el.addEventListener("click", fn)', 'el.click = fn', 'el.trigger("click")'], answer: 1 },
      { q: 'What does a function return by default if nothing is returned?', options: ['0', 'null', 'undefined', 'false'], answer: 2 }
    ]
  },
  webdev: {
    title: 'Web Development (HTML + CSS + JS)',
    icon: 'fa-laptop-code',
    duration: '8 Weeks',
    level: 'Beginner to Intermediate',
    type: 'web',
    lessons: [
      { title: '1. Putting it together', body: 'HTML gives structure, CSS gives style, JavaScript gives behavior. A real page mixes all three — try editing all tabs in the editor below.' },
      { title: '2. Responsive layouts', body: 'Combine Flexbox with media queries so your HTML looks great on any screen size.' },
      { title: '3. Interactivity', body: 'Use JavaScript to respond to clicks, validate forms, and update the page without reloading it.' }
    ],
    starter: {
      html: '<div class="card">\n  <h2>Safi Card</h2>\n  <button id="likeBtn">❤ Like</button>\n  <p id="count">0 likes</p>\n</div>',
      css: '.card{ font-family:sans-serif; text-align:center; padding:20px; border:1px solid #ddd; border-radius:12px; max-width:240px; margin:20px auto;}\nbutton{ padding:8px 16px; border-radius:20px; border:none; background:#ef4444; color:#fff; cursor:pointer;}',
      js: 'let n = 0;\ndocument.getElementById("likeBtn").addEventListener("click", function(){\n  n++;\n  document.getElementById("count").textContent = n + " likes";\n});'
    },
    quiz: [
      { q: 'In a real webpage, which layer is responsible for behavior?', options: ['HTML', 'CSS', 'JavaScript', 'Fonts'], answer: 2 },
      { q: 'Which combination makes a layout responsive?', options: ['Flexbox + media queries', 'Only <table>', 'Only inline styles', 'Only JavaScript'], answer: 0 },
      { q: 'What updates the page without a full reload?', options: ['Refreshing the tab', 'JavaScript DOM updates', 'Changing the URL', 'Restarting the browser'], answer: 1 },
      { q: 'Which file type holds the page structure?', options: ['.css', '.js', '.html', '.json'], answer: 2 }
    ]
  },
  python: {
    title: 'Python Programming',
    icon: 'fa-python',
    duration: '10 Weeks',
    level: 'Beginner to Advanced',
    type: 'python',
    lessons: [
      { title: '1. Syntax & Variables', body: 'Python uses indentation instead of curly braces. <code>x = 5</code> creates a variable — no type keyword needed.' },
      { title: '2. Loops & Conditions', body: '<code>for item in list:</code> and <code>if/else</code> control the flow of your program.' },
      { title: '3. Functions & Data Structures', body: 'Use <code>def my_func():</code> for reusable code, and lists/dictionaries to organize data.' }
    ],
    starterCode: 'name = "Safi Coder"\nfor i in range(3):\n    print(f"Hello, {name}! ({i+1})")',
    quiz: [
      { q: 'How does Python define blocks of code?', options: ['Curly braces {}', 'Indentation', 'Semicolons', 'Tags'], answer: 1 },
      { q: 'Which keyword starts a function definition?', options: ['func', 'function', 'def', 'lambda only'], answer: 2 },
      { q: 'Which loops over items in a list?', options: ['for item in list:', 'loop item in list:', 'foreach item:', 'while item:'], answer: 0 },
      { q: 'Which built-in prints text to the console?', options: ['echo()', 'print()', 'console.log()', 'write()'], answer: 1 }
    ]
  },
  ai: {
    title: 'Artificial Intelligence',
    icon: 'fa-robot',
    duration: '12 Weeks',
    level: 'Intermediate to Advanced',
    type: 'python',
    lessons: [
      { title: '1. What is AI?', body: 'AI systems learn patterns from data instead of following hard-coded rules. Machine Learning is one major branch of AI.' },
      { title: '2. Data & Features', body: 'Models learn from numeric "features". Even text and images get converted into numbers before training.' },
      { title: '3. A Simple Rule-Based Model', body: 'Before deep learning, try simple logic — it teaches you how a model turns input into a decision.' }
    ],
    starterCode: 'def predict_mood(score):\n    if score > 7:\n        return "Happy"\n    elif score > 4:\n        return "Neutral"\n    else:\n        return "Sad"\n\nfor s in [9, 5, 2]:\n    print(f"Score {s} -> {predict_mood(s)}")',
    quiz: [
      { q: 'What does a Machine Learning model mainly learn from?', options: ['Hard-coded rules only', 'Data patterns', 'Random guesses', 'CSS files'], answer: 1 },
      { q: 'Before training, text/images are converted into...', options: ['Numbers (features)', 'PDF files', 'HTML tags', 'Nothing, used as-is'], answer: 0 },
      { q: 'A simple if/else model is an example of...', options: ['Deep learning', 'Rule-based logic', 'Quantum computing', 'A database'], answer: 1 },
      { q: 'Which Python library is commonly used for deep learning?', options: ['TensorFlow', 'Bootstrap', 'jQuery', 'Sass'], answer: 0 }
    ]
  }
};

/* =========================================================
   WORKSPACE STATE
   ========================================================= */
var wsState = { courseId: null };

function openCourse(id) {
  var course = COURSES[id];
  if (!course) return;
  wsState.courseId = id;

  var solidIcons = ['fa-laptop-code', 'fa-robot'];
  var family = solidIcons.indexOf(course.icon) !== -1 ? 'fa-solid' : 'fa-brands';
  document.getElementById('wsIcon').className = family + ' ' + course.icon + ' course-icon';
  document.getElementById('wsTitle').textContent = course.title;
  document.getElementById('wsMeta').textContent = course.level + ' • ' + course.duration;

  renderLessons(course);
  renderEditor(course);
  renderQuiz(course, id);
  renderCertificateTab(id);

  switchTab('lessons');
  document.getElementById('workspaceOverlay').classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeWorkspace() {
  document.getElementById('workspaceOverlay').classList.remove('active');
  document.body.style.overflow = '';
}

function switchTab(tab) {
  document.querySelectorAll('.ws-tab').forEach(function (t) {
    t.classList.toggle('active', t.dataset.tab === tab);
  });
  document.querySelectorAll('.ws-panel').forEach(function (p) {
    p.classList.toggle('active', p.dataset.panel === tab);
  });
}

/* ---------------- Lessons ---------------- */
function renderLessons(course) {
  var wrap = document.getElementById('panelLessons');
  wrap.innerHTML = course.lessons.map(function (l) {
    return '<div class="lesson"><h4>' + l.title + '</h4><p>' + l.body + '</p></div>';
  }).join('');
}

/* ---------------- Code editor ---------------- */
function renderEditor(course) {
  var wrap = document.getElementById('panelCode');
  if (course.type === 'web') {
    wrap.innerHTML =
      '<div class="editor-grid web">' +
      '<div class="code-field"><label>HTML</label><textarea id="codeHtml">' + escapeHtml(course.starter.html) + '</textarea></div>' +
      '<div class="code-field"><label>CSS</label><textarea id="codeCss">' + escapeHtml(course.starter.css) + '</textarea></div>' +
      '<div class="code-field"><label>JavaScript</label><textarea id="codeJs">' + escapeHtml(course.starter.js) + '</textarea></div>' +
      '</div>' +
      '<div class="editor-actions">' +
      '<button class="btn btn-primary" onclick="runWebCode()"><i class="fa-solid fa-play"></i>&nbsp; Run</button>' +
      '<button class="btn btn-outline" onclick="resetEditor()">Reset</button>' +
      '</div>' +
      '<iframe class="preview-frame" id="previewFrame"></iframe>';
    setTimeout(runWebCode, 50);
  } else {
    wrap.innerHTML =
      '<div class="code-field python"><label>Python</label><textarea id="codePy">' + escapeHtml(course.starterCode) + '</textarea></div>' +
      '<div class="editor-actions">' +
      '<button class="btn btn-primary" onclick="runPythonCode()"><i class="fa-solid fa-play"></i>&nbsp; Run</button>' +
      '<button class="btn btn-outline" onclick="resetEditor()">Reset</button>' +
      '</div>' +
      '<div class="py-status" id="pyStatus">Python engine loads on first run (a few seconds).</div>' +
      '<pre class="output-console" id="pyOutput">// Output will appear here</pre>';
  }
}

function resetEditor() {
  var course = COURSES[wsState.courseId];
  renderEditor(course);
}

function escapeHtml(str) {
  return (str || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function runWebCode() {
  var html = document.getElementById('codeHtml').value;
  var css = document.getElementById('codeCss').value;
  var js = document.getElementById('codeJs').value;
  var doc = '<!DOCTYPE html><html><head><style>' + css + '</style></head><body>' + html +
    '<script>try{' + js + '}catch(e){document.body.innerHTML += "<p style=\\"color:red;font-family:sans-serif\\">" + e.message + "</p>";}<\/script></body></html>';
  var frame = document.getElementById('previewFrame');
  frame.srcdoc = doc;
}

/* ---------------- Python runner (Pyodide) ---------------- */
var pyodideInstance = null;
var pyodideLoading = null;

function loadPyodideOnce() {
  if (pyodideInstance) return Promise.resolve(pyodideInstance);
  if (pyodideLoading) return pyodideLoading;

  pyodideLoading = new Promise(function (resolve, reject) {
    var script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/pyodide/v0.26.4/full/pyodide.js';
    script.onload = function () {
      window.loadPyodide().then(function (py) {
        pyodideInstance = py;
        resolve(py);
      }).catch(reject);
    };
    script.onerror = function () { reject(new Error('Could not load the Python engine. Check your internet connection.')); };
    document.body.appendChild(script);
  });
  return pyodideLoading;
}

function runPythonCode() {
  var status = document.getElementById('pyStatus');
  var output = document.getElementById('pyOutput');
  var code = document.getElementById('codePy').value;

  status.textContent = pyodideInstance ? 'Running...' : 'Loading Python engine (first run only)...';
  output.textContent = '';

  loadPyodideOnce().then(function (py) {
    status.textContent = 'Running...';
    try {
      py.runPython(
        'import sys, io\n' +
        'sys.stdout = io.StringIO()\n' +
        'sys.stderr = sys.stdout\n'
      );
      py.runPython(code);
      var captured = py.runPython('sys.stdout.getvalue()');
      output.textContent = captured || '(no output — try adding a print() statement)';
      status.textContent = 'Done.';
    } catch (err) {
      output.textContent = String(err);
      status.textContent = 'Error while running your code.';
    }
  }).catch(function (err) {
    status.textContent = '';
    output.textContent = err.message;
  });
}

/* ---------------- Quiz ---------------- */
function renderQuiz(course, id) {
  var wrap = document.getElementById('panelQuiz');
  var html = course.quiz.map(function (q, qi) {
    var opts = q.options.map(function (opt, oi) {
      return '<label class="quiz-opt" data-q="' + qi + '" data-o="' + oi + '">' +
        '<input type="radio" name="q' + qi + '" value="' + oi + '"> ' + opt + '</label>';
    }).join('');
    return '<div class="quiz-q"><p class="q-title">' + (qi + 1) + '. ' + q.q + '</p>' + opts + '</div>';
  }).join('');

  html += '<button class="btn btn-primary" onclick="submitQuiz(\'' + id + '\')"><i class="fa-solid fa-check"></i>&nbsp; Submit Quiz</button>' +
    '<div class="quiz-result" id="quizResult"></div>';
  wrap.innerHTML = html;
}

function submitQuiz(id) {
  var course = COURSES[id];
  var total = course.quiz.length;
  var correct = 0;

  course.quiz.forEach(function (q, qi) {
    var selected = document.querySelector('input[name="q' + qi + '"]:checked');
    var selectedVal = selected ? parseInt(selected.value, 10) : -1;
    document.querySelectorAll('.quiz-opt[data-q="' + qi + '"]').forEach(function (label) {
      var oi = parseInt(label.dataset.o, 10);
      if (oi === q.answer) label.classList.add('correct');
      else if (oi === selectedVal) label.classList.add('wrong');
    });
    if (selectedVal === q.answer) correct++;
  });

  var pct = Math.round((correct / total) * 100);
  var passed = pct >= 70;
  var result = document.getElementById('quizResult');
  result.className = 'quiz-result show ' + (passed ? 'pass' : 'fail');
  result.textContent = correct + '/' + total + ' correct (' + pct + '%) — ' +
    (passed ? 'Passed! You can now claim your certificate.' : 'Not passed yet. Review the lessons and try again.');

  if (passed) {
    localStorage.setItem('safi_passed_' + id, '1');
    renderCertificateTab(id);
  }
}

/* ---------------- Certificate ---------------- */
function renderCertificateTab(id) {
  var wrap = document.getElementById('panelCertificate');
  var passed = localStorage.getItem('safi_passed_' + id) === '1';
  var course = COURSES[id];

  if (!passed) {
    wrap.innerHTML =
      '<div class="cert-locked"><i class="fa-solid fa-lock"></i>' +
      '<p>Pass the quiz (70% or higher) to unlock your certificate for <strong>' + course.title + '</strong>.</p></div>';
    return;
  }

  var savedName = localStorage.getItem('safi_student_name') || '';
  wrap.innerHTML =
    '<div class="cert-form">' +
    '<input type="text" id="certName" placeholder="Your full name" value="' + escapeHtml(savedName) + '">' +
    '<button class="btn btn-accent" onclick="generateCertificate(\'' + id + '\')"><i class="fa-solid fa-award"></i>&nbsp; Generate Certificate</button>' +
    '</div>' +
    '<canvas id="certificateCanvas" width="1000" height="700" style="display:none;"></canvas>' +
    '<div class="editor-actions" id="certDownloadRow" style="display:none;">' +
    '<button class="btn btn-primary" id="certDownloadBtn"><i class="fa-solid fa-download"></i>&nbsp; Download Certificate</button>' +
    '</div>';
}

function generateCertificate(id) {
  var course = COURSES[id];
  var nameInput = document.getElementById('certName');
  var name = (nameInput.value || 'Safi Student').trim();
  localStorage.setItem('safi_student_name', name);

  var canvas = document.getElementById('certificateCanvas');
  var ctx = canvas.getContext('2d');
  var w = canvas.width, h = canvas.height;

  // background
  ctx.fillStyle = '#fbfaff';
  ctx.fillRect(0, 0, w, h);

  // border
  ctx.strokeStyle = '#4f46e5';
  ctx.lineWidth = 10;
  ctx.strokeRect(24, 24, w - 48, h - 48);
  ctx.strokeStyle = '#12b3a0';
  ctx.lineWidth = 3;
  ctx.strokeRect(42, 42, w - 84, h - 84);

  ctx.textAlign = 'center';
  ctx.fillStyle = '#4f46e5';
  ctx.font = '700 30px Poppins, sans-serif';
  ctx.fillText('SAFI COURSES', w / 2, 130);

  ctx.fillStyle = '#1c1f2e';
  ctx.font = '600 20px Poppins, sans-serif';
  ctx.fillText('CERTIFICATE OF COMPLETION', w / 2, 175);

  ctx.font = '400 16px Poppins, sans-serif';
  ctx.fillStyle = '#6b7086';
  ctx.fillText('This certifies that', w / 2, 250);

  ctx.font = '700 42px Poppins, sans-serif';
  ctx.fillStyle = '#1c1f2e';
  ctx.fillText(name, w / 2, 320);

  ctx.font = '400 16px Poppins, sans-serif';
  ctx.fillStyle = '#6b7086';
  ctx.fillText('has successfully completed the course', w / 2, 370);

  ctx.font = '700 26px Poppins, sans-serif';
  ctx.fillStyle = '#12b3a0';
  ctx.fillText(course.title, w / 2, 415);

  var today = new Date();
  var dateStr = today.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });
  ctx.font = '400 15px Poppins, sans-serif';
  ctx.fillStyle = '#6b7086';
  ctx.fillText('Issued on ' + dateStr, w / 2, 470);

  // seal
  ctx.beginPath();
  ctx.arc(w / 2, 560, 46, 0, Math.PI * 2);
  ctx.fillStyle = '#4f46e5';
  ctx.fill();
  ctx.fillStyle = '#fff';
  ctx.font = '700 14px Poppins, sans-serif';
  ctx.fillText('SAFI', w / 2, 555);
  ctx.fillText('VERIFIED', w / 2, 572);

  canvas.style.display = 'block';
  var row = document.getElementById('certDownloadRow');
  row.style.display = 'flex';
  document.getElementById('certDownloadBtn').onclick = function () {
    var link = document.createElement('a');
    link.download = 'Safi-Certificate-' + course.title.replace(/\s+/g, '-') + '.png';
    link.href = canvas.toDataURL('image/png');
    link.click();
  };
}

/* =========================================================
   AI ASSISTANT (FAQ-style, no API key required)
   ========================================================= */
var AI_KB = [
  { keywords: ['certificate', 'certifcate', 'cert'], response: 'Any course pe jaakar "Certificate" tab kholain — pehle quiz mein 70% ya usse zyada score chahiye, uske baad apna naam likh kar certificate generate aur download kar sakte hain.' },
  { keywords: ['quiz', 'test', 'exam'], response: 'Har course ke "Quiz" tab mein 4 MCQs hain. 70% ya usse zyada score karne par aap certificate unlock kar lete hain — jitni baar chahain dobara attempt kar sakte hain.' },
  { keywords: ['code', 'editor', 'run', 'compile'], response: 'Har course ke "Code" tab mein editor hai. HTML/CSS/JS courses live preview dikhate hain, aur Python/AI courses real Python engine (Pyodide) browser mein hi chala kar output dete hain — koi installation nahi chahiye.' },
  { keywords: ['python'], response: 'Python course beginner se advanced tak hai: syntax, loops, functions, aur data structures. Code tab mein likh kar turant Run kar sakte hain.' },
  { keywords: ['price', 'fee', 'cost', 'payment'], response: 'Featured courses ka pricing course card ke enroll modal mein dikhta hai (jaise Web Development $49.99, Python $59.99, AI $79.99).' },
  { keywords: ['dark', 'theme', 'light mode'], response: 'Navbar ke moon/sun icon se dark aur light theme switch kar sakte hain — aapki pasand save ho jati hai.' },
  { keywords: ['contact', 'support', 'help'], response: 'Neeche footer mein social icons se humein reach out kar sakte hain. Website ke andar kisi bhi feature ke baare mein mujh se bhi pooch sakte hain!' },
  { keywords: ['ai', 'artificial intelligence', 'machine learning'], response: 'AI course mein Machine Learning basics, data/features, aur simple rule-based models cover hote hain — Code tab mein Python examples khud run kar sakte hain.' },
  { keywords: ['hi', 'hello', 'salam', 'assalam'], response: 'Assalam-o-Alaikum! Main Safi Assistant hoon — courses, quiz, code editor ya certificate ke baare mein kuch bhi pooch lein.' }
];

function aiToggle() {
  var panel = document.getElementById('aiPanel');
  panel.classList.toggle('open');
}

function aiAsk(text) {
  var input = document.getElementById('aiInput');
  var msg = (text !== undefined ? text : input.value).trim();
  if (!msg) return;
  addAiMessage(msg, 'user');
  input.value = '';

  setTimeout(function () {
    addAiMessage(getAiReply(msg), 'bot');
  }, 450);
}

function getAiReply(msg) {
  var lower = msg.toLowerCase();
  var best = null, bestScore = 0;
  AI_KB.forEach(function (entry) {
    var score = entry.keywords.reduce(function (acc, kw) {
      return acc + (lower.indexOf(kw) !== -1 ? 1 : 0);
    }, 0);
    if (score > bestScore) { bestScore = score; best = entry; }
  });
  if (best) return best.response;
  return 'Yeh sawal thora specific chahiye — courses, quiz, certificate, ya code editor ke baare mein pooch kar dekhein. Neeche diye chips bhi try kar sakte hain.';
}

function addAiMessage(text, who) {
  var wrap = document.getElementById('aiMessages');
  var div = document.createElement('div');
  div.className = 'ai-msg ' + who;
  div.textContent = text;
  wrap.appendChild(div);
  wrap.scrollTop = wrap.scrollHeight;
}

document.addEventListener('DOMContentLoaded', function () {
  var input = document.getElementById('aiInput');
  if (input) {
    input.addEventListener('keydown', function (e) {
      if (e.key === 'Enter') aiAsk();
    });
  }
});

/* ---------------- Close workspace on backdrop click ---------------- */
document.addEventListener('DOMContentLoaded', function () {
  var overlay = document.getElementById('workspaceOverlay');
  if (overlay) {
    overlay.addEventListener('click', function (e) {
      if (e.target === overlay) closeWorkspace();
    });
  }
});