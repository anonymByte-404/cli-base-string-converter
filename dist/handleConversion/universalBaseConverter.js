/**
 * Universal Base Conversion Module
 *
 * Provides functionality to convert numbers to any base from Base 1 to Base 64,
 * including converting ASCII values into readable text.
 */
var __awaiter =
  (this && this.__awaiter) ||
  function (thisArg, _arguments, P, generator) {
    function adopt(value) {
      return value instanceof P
        ? value
        : new P(function (resolve) {
            resolve(value)
          })
    }
    return new (P || (P = Promise))(function (resolve, reject) {
      function fulfilled(value) {
        try {
          step(generator.next(value))
        } catch (e) {
          reject(e)
        }
      }
      function rejected(value) {
        try {
          step(generator['throw'](value))
        } catch (e) {
          reject(e)
        }
      }
      function step(result) {
        result.done
          ? resolve(result.value)
          : adopt(result.value).then(fulfilled, rejected)
      }
      step((generator = generator.apply(thisArg, _arguments || [])).next())
    })
  }
/**
 * Generates a list of base options from Base 1 to Base 64.
 *
 * @returns {string[]} An array of base options as strings (e.g., ["Base 1", ..., "Base 64"]).
 */
const generateBaseChoices = () =>
  Array.from({ length: 64 }, (_, i) => `Base ${i + 1}`)
/**
 * Initial list of conversion choices, including the "String" option.
 */
const initialChoices = ['String', ...generateBaseChoices()]
/**
 * Entry point for the universal base converter.
 *
 * @param inquirer - Inquirer.js instance for CLI interaction.
 * @param main - Callback to return to the main menu.
 * @param typewriterEffect - Function for displaying text with a typewriter effect.
 * @param fadeOutEffect - Function for fading out text with an animation effect.
 * @param chalk - Chalk instance for styling console output.
 */
export function universalBaseConverter(
  inquirer,
  main,
  typewriterEffect,
  fadeOutEffect,
  chalk
) {
  let availableChoices = [...initialChoices] // Clone initial choices to maintain state.
  /**
   * Starts the base conversion process by presenting a list of options.
   */
  const startConversion = () => {
    inquirer
      .prompt([
        {
          type: 'list',
          name: 'selectedBase',
          message: 'Select the base to convert to:',
          choices: availableChoices,
        },
      ])
      .then((answers) => {
        const selectedBase = answers.selectedBase
        if (selectedBase === 'String') {
          convertToString(
            inquirer,
            startConversion, // Restart conversion if selected
            main,
            typewriterEffect,
            fadeOutEffect,
            chalk
          )
        } else {
          const baseMatch = selectedBase.match(/Base (\d+)/)
          if (baseMatch) {
            const base = parseInt(baseMatch[1], 10)
            convertToBase(
              base,
              inquirer,
              startConversion, // Restart conversion if selected
              main,
              typewriterEffect,
              fadeOutEffect,
              chalk
            )
          } else {
            console.error(
              chalk.red('Invalid base selection. Please try again.')
            )
            startConversion() // Restart if invalid base selected
          }
        }
      })
      .catch((error) => {
        console.error(chalk.red('Error selecting a conversion base:', error))
      })
  }
  startConversion() // Initially start the conversion process
}
/**
 * Converts numeric data to a specified base.
 *
 * @param base - The base to convert to (1–64).
 * @param inquirer - Inquirer.js instance for CLI interaction.
 * @param restartConversion - Callback to restart the conversion process.
 * @param main - Callback to return to the main menu.
 * @param typewriterEffect - Function for displaying text with a typewriter effect.
 * @param fadeOutEffect - Function for fading out text with an animation effect.
 * @param chalk - Chalk instance for styling console output.
 */
function convertToBase(
  base,
  inquirer,
  restartConversion,
  main,
  typewriterEffect,
  fadeOutEffect,
  chalk
) {
  inquirer
    .prompt([
      {
        type: 'input',
        name: 'inputData',
        message: `Enter numbers (space-separated) to convert to Base ${base}:`,
      },
    ])
    .then((answers) => {
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
            return parsed.toString(base)
          })
          .join(' ')
        console.log(chalk.green(`Converted to Base ${base}: ${converted}`))
      } catch (error) {
        if (error instanceof Error) {
          console.error(chalk.red(error.message))
        } else {
          console.error(chalk.red('An unexpected error occurred:', error))
        }
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
    .catch((error) => {
      console.error(
        chalk.red(`Error during conversion to Base ${base}:`, error)
      )
    })
}
/**
 * Converts ASCII values to a readable string.
 *
 * @param inquirer - Inquirer.js instance for CLI interaction.
 * @param restartConversion - Callback to restart the conversion process.
 * @param main - Callback to return to the main menu.
 * @param typewriterEffect - Function for displaying text with a typewriter effect.
 * @param fadeOutEffect - Function for fading out text with an animation effect.
 * @param chalk - Chalk instance for styling console output.
 */
function convertToString(
  inquirer,
  restartConversion,
  main,
  typewriterEffect,
  fadeOutEffect,
  chalk
) {
  inquirer
    .prompt([
      {
        type: 'input',
        name: 'inputData',
        message: 'Enter ASCII values (space-separated) to convert to text:',
      },
    ])
    .then((answers) => {
      const asciiValues = answers.inputData.trim().split(' ')
      try {
        const text = asciiValues
          .map((val) => {
            const parsed = parseInt(val, 10)
            if (isNaN(parsed)) {
              throw new Error(
                `Invalid ASCII value: "${val}". Please provide valid values.`
              )
            }
            return String.fromCharCode(parsed)
          })
          .join('')
        console.log(chalk.green(`Converted to text: "${text}"`))
      } catch (error) {
        if (error instanceof Error) {
          console.error(chalk.red(error.message))
        } else {
          console.error(chalk.red('An unexpected error occurred:', error))
        }
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
    .catch((error) => {
      console.error(chalk.red('Error during conversion to text:', error))
    })
}
/**
 * Prompts the user for their next action.
 *
 * @param inquirer - Inquirer.js instance for CLI interaction.
 * @param restartConversion - Callback to restart the conversion process.
 * @param main - Callback to return to the main menu.
 * @param typewriterEffect - Function for displaying text with a typewriter effect.
 * @param fadeOutEffect - Function for fading out text with an animation effect.
 * @param chalk - Chalk instance for styling console output.
 */
function askNextAction(
  inquirer,
  restartConversion,
  main,
  typewriterEffect,
  fadeOutEffect,
  chalk
) {
  inquirer
    .prompt([
      {
        type: 'list',
        name: 'nextAction',
        message: 'What would you like to do next?',
        choices: ['Convert again', 'Go back to Main Menu', 'Exit'],
      },
    ])
    .then((answers) =>
      __awaiter(this, void 0, void 0, function* () {
        switch (answers.nextAction) {
          case 'Convert again':
            restartConversion() // Restart conversion by calling the restartConversion callback
            break
          case 'Go back to Main Menu':
            main()
            break
          case 'Exit':
            yield typewriterEffect('Thanks for using the app. Goodbye!', 50)
            yield fadeOutEffect('Closing the application...', 10, 100)
            process.exit(0)
        }
      })
    )
    .catch((error) => {
      console.error(chalk.red('Error deciding next action:', error))
    })
}
