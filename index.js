class countCrates {
  columnsUp = [];
  columnsDown = [];
  rowsLeft = [];
  rowsRight = [];
  matrix;
  values;

  constructor(input) {
    const sqr = this.#squareRoot(this.parser(input).length);
    this.values = Array.from({ length: sqr }, (_, i) => i + 1);
    this.matrix = Array.from({ length: sqr }, (e) => Array(sqr).fill(0));
    this.solver();
    console.table(this.matrix);
  }

  solver() {
    for (let index = 0; index < this.columnsUp.length; index++) {
      const leftView = this.rowsLeft[index];
      const rightView = this.rowsRight[index];
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
      values = this.getRandom();
      let Lmax;
      let Rmax;
      console.log("proposed values", values);
      console.log("for this start-end:" + start, " " + end);
      console.table(this.matrix);

      for (let index = 0; index < values.length; index++) {
        if (this.columnAvailableCheck(index, values[index]) == false) {
          sumL = 1;
          sumR = 1;
          break;
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
        if (this.columnAvailableCheck(j, values[j]) == false) {
          sumL = 1;
          sumR = 1;
          break;
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

  getRandom() {
    let seen = new Set();
    const getRandomObj = () => {
      const i = Math.floor(Math.random() * this.values.length);
      return seen.has(this.values[i])
        ? getRandomObj()
        : (seen.add(this.values[i]), this.values[i]);
    };
    const rand = this.values.map(() => getRandomObj());
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

  #squareRoot(length) {
    for (let index = 0; index < length; index++) {
      if (index * index == length) {
        return index;
      }
    }
  }
}

// new countCrates("3 1 3 2 1 3 2 3 2 3 2 1 2 1 2 3");
new countCrates("3 2 2 1 1 2 2 3 3 2 2 1 1 2 2 3");

