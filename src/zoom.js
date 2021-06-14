const classList = ['fas', 'fa-search'];

class Zoom {
  createBtn() {
    const btn = document.createElement('button');
    btn.addEventListener('click', ()=> {
      const hasActive = document.querySelector('.tool.active');
      if(hasActive) hasActive.classList.remove('active');
      btn.classList.add('active');
      window.currentTool = 'text';
    });
    btn.classList.add('tool');
    classList.forEach((clas)=> { btn.classList.add(clas) });
    btn.classList.add('mag');
    return btn;
  }
}

const zoom = new Zoom();

export default zoom;