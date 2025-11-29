if (document.body.id === 'checklist-page') {
    const listItems = document.querySelectorAll('ul li');
  
    listItems.forEach((item) => {
      const span = item.querySelector('span');
      const existingCheckbox = span.querySelector('input[type="checkbox"]');
      if (existingCheckbox) {
        existingCheckbox.remove();
      }
      const newCheckbox = document.createElement('input');
      newCheckbox.type = 'checkbox';
      span.insertBefore(newCheckbox, span.firstChild);  
    });
  }
  