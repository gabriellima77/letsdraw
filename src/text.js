class Text {
  createBtn() {
    const btn = document.createElement('button');
    btn.addEventListener('click', ()=> {
      const hasActive = document.querySelector('.tool.active');
      if(hasActive) hasActive.classList.remove('active');
      btn.classList.add('active');
      window.currentTool = 'text';
    });
    btn.classList.add('tool');
    btn.classList.add('text');
    return btn;
  }
}

const text = new Text();

export default text;