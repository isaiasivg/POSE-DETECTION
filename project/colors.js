let notStarted = true;

const exercises = [];
const counters = [0, 0, 0, 0, 0, 0, 0];
const colors = ['#fcfe90', '#b4f0e9', '#43d70d'];

function loadData() {
  // Get the exercise container
  const exerciseContainer = document.querySelector('.exercise-container');

  // Iterate over the child elements and save them in the array
  for (let i = 0; i < exerciseContainer.children.length; i++) {
    exercises.push(exerciseContainer.children[i]);
  }
}

/*
  When a exercise is done, it calls this function with the numbre of the exercise
  to chenge the color of that exercise

  If plank is done end = true is sended as parameter
*/
export function changeColor(n, end = false) {
  if (notStarted) {
    loadData();
    notStarted = false;
  }
  if (end) {
    exercises[n].style.backgroundColor = colors[2];
  } else {
    exercises[n].style.backgroundColor = colors[counters[n]];
    counters[n] = counters[n] < 2 ? counters[n] + 1 : 2;        // If counter > 2 don't increase 
  }

  // Create the effect 
  exercises[n].classList.add('elevate');

  // Remove the class after 0.3 seconds to simulate the lowering
  setTimeout(() => {
    exercises[n].classList.remove('elevate');
  }, 300); 
}
