const BASE_CHARACTERS =
  '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz+/'

/**
 * Generates a list of base options from Base 1 to Base 64.
 *
 * @returns {string[]} An array of base options as strings (e.g., ["Base 1", ..., "Base 64"]).
 */
const generateBaseChoices = (): string[] =>
  Array.from({ length: 64 }, (_, i) => `Base ${i + 1}`)

const initialChoices: string[] = ['String', ...generateBaseChoices()]

/**
 * Entry point for the universal base converter.
 *
 * @param {any} inquirer - The Inquirer.js instance for handling CLI interactions.
 * @param {function} main - The callback function to return to the main menu.
 * @param {function} typewriterEffect - A function to display text using a typewriter effect.
 * @param {function} fadeOutEffect - A function to fade out text with a customizable animation effect.
 * @param {any} chalk - An instance of Chalk.js for styling console output.
 */
export function universalBaseConverter(
  inquirer: any,
  main: () => void,
  typewriterEffect: (text: string, delay: number) => Promise<void>,
  fadeOutEffect: (text: string, steps: number, delay: number) => Promise<void>,
  chalk: any
): void {
  let selectedBase: number | null = null

  /**
   * Begins the conversion process by prompting the user to select a base.
   */
  const startConversion = (): void => {
    inquirer
      .prompt([
        {
          type: 'list',
          name: 'selectedBase',
          message: 'Select the base to convert to:',
          choices: initialChoices,
        },
      ])
      .then((answers: { selectedBase: string }) => {
        const selectedBaseOption = answers.selectedBase

        if (selectedBaseOption === 'String') {
          convertToString(
            inquirer,
            startConversion,
            main,
            typewriterEffect,
            fadeOutEffect,
            chalk
          )
        } else {
          const baseMatch = selectedBaseOption.match(/Base (\d+)/)
          if (baseMatch) {
            selectedBase = parseInt(baseMatch[1], 10)
            convertToBase(
              selectedBase,
              inquirer,
              startConversion,
              main,
              typewriterEffect,
              fadeOutEffect,
              chalk
            )
          } else {
            console.error(
              chalk.red('Invalid base selection. Please try again.')
            )
            startConversion()
          }
        }
      })
      .catch((error: unknown) => {
        console.error(chalk.red('Error selecting a conversion base:', error))
      })
  }

  startConversion()
}

/**
 * Converts a number to the specified base.
 *
 * @param {number} num - The number to convert.
 * @param {number} base - The target base (1–64).
 * @returns {string} The number converted to the specified base as a string.
 */
function numberToBase(num: number, base: number): string {
  if (base === 1) {
    return '1'.repeat(num)
  }

  let result = ''
  while (num > 0) {
    result = BASE_CHARACTERS[num % base] + result
    num = Math.floor(num / base)
  }
  return result || '0'
}

/**
 * Converts a string representation in a given base to a number.
 *
 * @param {string} str - The string representation of the number in the specified base.
 * @param {number} base - The base of the input string (1–64).
 * @returns {number} The number represented by the string in the specified base.
 */
function baseToNumber(str: string, base: number): number {
  if (base === 1) {
    return str.length
  }

  return str
    .split('')
    .reduce((acc, char) => acc * base + BASE_CHARACTERS.indexOf(char), 0)
}

/**
 * Handles the conversion of numbers to a specified base.
 *
 * @param {number} base - The target base for the conversion (1–64).
 * @param {any} inquirer - The Inquirer.js instance for handling CLI interactions.
 * @param {function} restartConversion - A callback to restart the conversion process.
 * @param {function} main - The callback function to return to the main menu.
 * @param {function} typewriterEffect - A function to display text using a typewriter effect.
 * @param {function} fadeOutEffect - A function to fade out text with a customizable animation effect.
 * @param {any} chalk - An instance of Chalk.js for styling console output.
 */
function convertToBase(
  base: number,
  inquirer: any,
  restartConversion: () => void,
  main: () => void,
  typewriterEffect: (text: string, delay: number) => Promise<void>,
  fadeOutEffect: (text: string, steps: number, delay: number) => Promise<void>,
  chalk: any
): void {
  inquirer
    .prompt([
      {
        type: 'input',
        name: 'inputData',
        message: `Enter numbers (space-separated) to convert to Base ${base}:`,
      },
    ])
    .then((answers: { inputData: string }) => {
      const numbers = answers.inputData.trim().split(' ')

      try {
        const converted = numbers
          .map((num) => {
            const parsed = parseInt(num, 10)
            if (isNaN(parsed)) {
              throw new Error(
                `Invalid number: "${num}". Please provide valid numbers.`
              )
            }
            return numberToBase(parsed, base)
          })
          .join(' ')

        console.log(chalk.green(`Converted to Base ${base}: ${converted}`))
      } catch (error: unknown) {
        console.error(chalk.red((error as Error).message))
      }

      askNextAction(
        inquirer,
        restartConversion,
        main,
        typewriterEffect,
        fadeOutEffect,
        chalk
      )
    })
    .catch((error: unknown) => {
      console.error(
        chalk.red(`Error during conversion to Base ${base}:`, error)
      )
    })
}

/**
 * Handles the conversion of base strings to ASCII or readable text.
 *
 * @param {any} inquirer - The Inquirer.js instance for handling CLI interactions.
 * @param {function} restartConversion - A callback to restart the conversion process.
 * @param {function} main - The callback function to return to the main menu.
 * @param {function} typewriterEffect - A function to display text using a typewriter effect.
 * @param {function} fadeOutEffect - A function to fade out text with a customizable animation effect.
 * @param {any} chalk - An instance of Chalk.js for styling console output.
 */
function convertToString(
  inquirer: any,
  restartConversion: () => void,
  main: () => void,
  typewriterEffect: (text: string, delay: number) => Promise<void>,
  fadeOutEffect: (text: string, steps: number, delay: number) => Promise<void>,
  chalk: any
): void {
  inquirer
    .prompt([
      {
        type: 'input',
        name: 'inputData',
        message:
          'Enter base-encoded values (space-separated) to convert back to text:',
      },
    ])
    .then((answers: { inputData: string }) => {
      const values = answers.inputData.trim().split(' ')

      try {
        const text = values
          .map((val) => {
            const number = baseToNumber(val, 2)
            return String.fromCharCode(number)
          })
          .join('')

        console.log(chalk.green(`Converted to text: "${text}"`))
      } catch (error: unknown) {
        console.error(chalk.red((error as Error).message))
      }

      askNextAction(
        inquirer,
        restartConversion,
        main,
        typewriterEffect,
        fadeOutEffect,
        chalk
      )
    })
    .catch((error: unknown) => {
      console.error(chalk.red('Error during conversion to text:', error))
    })
}

/**
 * Prompts the user for their next action.
 *
 * @param {any} inquirer - The Inquirer.js instance for handling CLI interactions.
 * @param {function} restartConversion - A callback to restart the conversion process.
 * @param {function} main - The callback function to return to the main menu.
 * @param {function} typewriterEffect - A function to display text using a typewriter effect.
 * @param {function} fadeOutEffect - A function to fade out text with a customizable animation effect.
 * @param {any} chalk - An instance of Chalk.js for styling console output.
 */
function askNextAction(
  inquirer: any,
  restartConversion: () => void,
  main: () => void,
  typewriterEffect: (text: string, delay: number) => Promise<void>,
  fadeOutEffect: (text: string, steps: number, delay: number) => Promise<void>,
  chalk: any
): void {
  inquirer
    .prompt([
      {
        type: 'list',
        name: 'nextAction',
        message: 'What would you like to do next?',
        choices: ['Convert again', 'Return to main menu'],
      },
    ])
    .then((answers: { nextAction: string }) => {
      if (answers.nextAction === 'Convert again') {
        restartConversion()
      } else {
        main()
      }
    })
    .catch((error: unknown) => {
      console.error(chalk.red('Error choosing next action:', error))
    })
}
