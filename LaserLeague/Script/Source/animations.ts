

function startCAnimation(){
    anime({
      targets: '.progressAnimation1',
      translateY: [-2, 2],
      loop: true,
      direction: 'alternate',
      duration: 50,
      easing: 'easeInOutElastic',
    });
  }

  function stopCAnimation(){
    anime({
      targets: '.progressAnimation1',
      translateY: [0, 0],
      loop: true,
      direction: 'alternate',
      duration: 50,
      easing: 'easeInOutElastic',
    });
  }

  function startHAnimation(){
    anime({
      targets: '.progressAnimation1',
      scale: 1.03,
      loop: true,
      direction: 'alternate',
      duration: 700,
      easing: 'easeInOutSine',

  });
  }

  function stopHAnimation(){
    anime({
      targets: '.progressAnimation1',
      scale: 1,
      loop: true,
      direction: 'alternate',
      duration: 700,
      easing: 'easeInOutSine',
 
  });
  }