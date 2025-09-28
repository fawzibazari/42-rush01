/**
 * Skyscraper puzzle solver class
 * Solves 4x4 skyscraper puzzles based on visibility constraints
 */
class SkyscraperSolver {
  columnsUp = [];
  columnsDown = [];
  rowsLeft = [];
  rowsRight = [];
  matrix;
  possiblities;

  constructor(input) {
    const sqr = this.#squareRoot(this.parser(input).length);
    this.possiblities = Array.from({ length: sqr }, (_, i) => i + 1);
    this.matrix = Array.from({ length: sqr }, (e) => Array(sqr).fill(0));
    this.solver();
    console.table(this.matrix);
  }

  solver() {
    for (let index = 0; index < this.possiblities.length; index++) {
      const leftView = this.rowsLeft[index];
      const rightView = this.rowsRight[index];
      this.seed();
      this.viewCount(Number(leftView), Number(rightView), index);
    }
  }

  viewCount(start, end, rowIndex) {
    let values;
    let sumL = 0;
    let sumR = 0;
    while (sumL != start || sumR != end) {
      sumL = 1;
      sumR = 1;
      let exclude = this.matrix[rowIndex].filter((row) => row != 0);
      values = this.getRandom(exclude);

      exclude.map((excluded) => {
        const indexof = this.matrix[rowIndex].indexOf(excluded);
        values.splice(indexof, 0, excluded);
        return excluded;
      });

      let Lmax;
      let Rmax;
      console.log("proposed values", values);
      console.log("for this start-end:" + start, " " + end);
      console.table(this.matrix);

      for (let index = 0; index < values.length; index++) {
        if (exclude && exclude.includes(values[index])) {
        } else {
          if (this.columnAvailableCheck(index, values[index]) == false) {
            sumL = 1;
            sumR = 1;
            break;
          }
        }

        if (!Lmax) {
          Lmax = values[index];
        }
        if (Lmax < values[index + 1]) {
          sumL++;
          Lmax = values[index + 1];
        }
      }

      for (let j = values.length - 1; j > 0; j--) {
        if (exclude && exclude.includes(values[j])) {
        } else {
          if (this.columnAvailableCheck(j, values[j]) == false) {
            sumL = 1;
            sumR = 1;
            break;
          }
        }

        if (!Rmax) {
          Rmax = values[j];
        }
        if (Rmax < values[j - 1]) {
          sumR++;
          Rmax = values[j - 1];
        }
      }
    }
    console.log(sumL, values, sumR, "VALID");
    console.log(`
================================================================
================================================================
      `);

    this.matrix[rowIndex] = values;
  }

  getRandom(valuesToExclude) {
    let seen = new Set();
    valuesToExclude.map((x) => seen.add(x));
    const getRandomObj = () => {
      const i = Math.floor(Math.random() * this.possiblities.length);
      return seen.has(this.possiblities[i])
        ? getRandomObj()
        : (seen.add(this.possiblities[i]), this.possiblities[i]);
    };
    const rand = Array.from({
      length: this.possiblities.length - valuesToExclude.length,
    }).map(() => getRandomObj());
    return rand;
  }

  columnAvailableCheck(index, number) {
    return !this.matrix.map((x) => x[index]).includes(number);
  }

  parser(input) {
    let splitInput = input.split(" ");
    this.columnsUp = splitInput.slice(0, 4);
    this.columnsDown = splitInput.slice(4, 8);
    this.rowsLeft = splitInput.slice(8, 12);
    this.rowsRight = splitInput.slice(12, 16);
    return splitInput;
  }

  seed() {
    for (let index = 0; index < this.possiblities.length; index++) {
      const upView = this.columnsUp[index];
      const bottomView = this.columnsDown[index];
      const leftView = this.rowsLeft[index];
      const rightView = this.rowsRight[index];
      const max = Math.max(...this.possiblities);
      const min = Math.min(...this.possiblities);

      // SET DEFAUT VALUES
      if (upView == "1") {
        this.matrix[0][index] = max;
      }
      if (upView == "4") {
        this.matrix[0][index] = min;
      }
      if (bottomView == "1") {
        this.matrix[max - 1][index] = max;
      }
      if (bottomView == "4") {
        this.matrix[max - 1][index] = min;
      }
      if (leftView == "1") {
        this.matrix[index][0] = max;
      }
      if (leftView == "4") {
        this.matrix[index][0] = min;
      }
      if (rightView == "1") {
        this.matrix[index][max - 1] = max;
      }
      if (rightView == "4") {
        this.matrix[index][max - 1] = min;
      }
    }
  }

  #squareRoot(length) {
    for (let index = 0; index < length; index++) {
      if (index * index == length) {
        return index;
      }
    }
  }
}

// new SkyscraperSolver("3 1 3 2 1 3 2 3 2 3 2 1 2 1 2 3");
// new SkyscraperSolver("2 2 4 1 3 2 1 3 2 1 2 3 1 2 3 2");
// new SkyscraperSolver("3 3 1 2 1 2 3 3 2 4 2 1 2 1 2 4");
new SkyscraperSolver("4 3 2 1 1 2 2 2 4 3 2 1 1 2 2 2");
