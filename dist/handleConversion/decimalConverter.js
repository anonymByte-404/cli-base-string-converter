/**
 * Decimal Conversion Module
 *
 * This module helps users convert decimal data into different formats,
 * like text (strings) or other numeral systems.
 * It uses a simple menu to guide users through the conversion process.
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
const choices = [
  'String',
  ...Array.from({ length: 64 }, (_, i) => `Base ${i + 1}`).filter(
    (base) => base !== 'Base 10'
  ),
]
/**
 * Start the decimal conversion process.
 *
 * Displays a menu where users can choose to convert decimal data into text
 * or a numeral system. Handles user input and guides them through the steps.
 */
export function decimalConverter(
  inquirer,
  main,
  typewriterEffect,
  fadeOutEffect
) {
  const startDecimalConversion = () => {
    inquirer
      .prompt([
        {
          type: 'list',
          name: 'selectedConversionBase',
          message: 'What format do you want to convert the decimal data to?',
          choices: choices,
        },
      ])
      .then((answers) => {
        switch (answers.selectedConversionBase) {
          case 'String':
            decimalToString(
              inquirer,
              startDecimalConversion,
              main,
              typewriterEffect,
              fadeOutEffect
            )
            break
          default: {
            const match = answers.selectedConversionBase.match(/Base (\d+)/)
            if (match) {
              const base = parseInt(match[1], 10)
              decimalToBase(
                inquirer,
                `Base ${base}`,
                base,
                startDecimalConversion,
                main,
                typewriterEffect,
                fadeOutEffect
              )
            } else {
              console.log(
                `Sorry, conversions for this format are not available yet.`
              )
              askNextAction(
                inquirer,
                startDecimalConversion,
                main,
                typewriterEffect,
                fadeOutEffect
              )
            }
          }
        }
      })
      .catch((error) => {
        console.error(
          'Something went wrong while selecting a conversion option:',
          error
        )
      })
  }
  startDecimalConversion()
}
/**
 * Convert decimal data into text.
 *
 * Asks the user to provide decimal data, validates it, and converts it
 * into readable text (ASCII characters).
 *
 * @param inquirer - The library for interactive menus and prompts.
 * @param callback - Function to restart the decimal conversion process.
 * @param main - Function to return to the main menu.
 */
function decimalToString(
  inquirer,
  callback,
  main,
  typewriterEffect,
  fadeOutEffect
) {
  const promptDecimalInput = () => {
    inquirer
      .prompt([
        {
          type: 'input',
          name: 'decimalInput',
          message: 'Enter the decimal data (separate groups with spaces):',
        },
      ])
      .then((answers) => {
        const decimalArray = answers.decimalInput.trim().split(' ')
        // Validate if all inputs are valid decimal numbers.
        if (!decimalArray.every((num) => /^\d+$/.test(num))) {
          console.log('Invalid input. Please enter decimal numbers only.')
          return promptDecimalInput()
        }
        // Convert decimal numbers to text.
        const result = decimalArray
          .map((num) => String.fromCharCode(parseInt(num, 10)))
          .join('')
        console.log(`Here is your text: "${result}"`)
        askNextAction(inquirer, callback, main, typewriterEffect, fadeOutEffect)
      })
      .catch((error) => {
        console.error('Error during conversion to text:', error)
      })
  }
  promptDecimalInput()
}
/**
 * Convert decimal data into a different numeral system.
 *
 * Asks the user to provide decimal data, validates it, and converts it into
 * the specified numeral system (e.g., Base 11, Base 16, etc.).
 *
 * @param inquirer - The library for interactive menus and prompts.
 * @param name - The name of the numeral system (e.g., "Base 11").
 * @param base - The numeral system's base (e.g., 11 for Base 11).
 * @param callback - Function to restart the decimal conversion process.
 * @param main - Function to return to the main menu.
 */
function decimalToBase(
  inquirer,
  name,
  base,
  callback,
  main,
  typewriterEffect,
  fadeOutEffect
) {
  const promptDecimalInput = () => {
    inquirer
      .prompt([
        {
          type: 'input',
          name: 'decimalInput',
          message: `Enter the decimal data (separate groups with spaces) to convert to ${name}:`,
        },
      ])
      .then((answers) => {
        const decimalArray = answers.decimalInput.trim().split(' ')
        // Validate if all inputs are valid decimal numbers.
        if (!decimalArray.every((num) => /^\d+$/.test(num))) {
          console.log('Invalid input. Please enter decimal numbers only.')
          return promptDecimalInput()
        }
        // Convert decimal numbers to the specified base.
        const result = decimalArray
          .map((num) => parseInt(num, 10).toString(base))
          .join(' ')
        console.log(`Here is your converted data in ${name}: ${result}`)
        askNextAction(inquirer, callback, main, typewriterEffect, fadeOutEffect)
      })
      .catch((error) => {
        console.error(`Error during conversion to ${name}:`, error)
      })
  }
  promptDecimalInput()
}
/**
 * Ask the user what they want to do next after completing a conversion.
 *
 * Provides options to convert again, go back to the main menu, or quit the app.
 *
 * @param inquirer - The library for interactive menus and prompts.
 * @param callback - Function to restart the decimal conversion process.
 * @param main - Function to return to the main menu.
 */
function askNextAction(
  inquirer,
  callback,
  main,
  typewriterEffect,
  fadeOutEffect
) {
  inquirer
    .prompt([
      {
        type: 'list',
        name: 'nextAction',
        message: 'What would you like to do next?',
        choices: [
          'Convert decimal data again.',
          'Go back to the Main Menu.',
          'Exit the application.',
        ],
      },
    ])
    .then((answers) =>
      __awaiter(this, void 0, void 0, function* () {
        switch (answers.nextAction) {
          case 'Convert decimal data again.':
            callback()
            break
          case 'Go back to the Main Menu.':
            console.log('Returning to the Main Menu...')
            main()
            break
          case 'Exit the application.':
            yield typewriterEffect('Thanks for using the app. Goodbye!', 50)
            yield fadeOutEffect('Closing the application...', 10, 100)
            process.exit(0) // Exit the app
        }
      })
    )
    .catch((error) => {
      console.error('Error while deciding the next action:', error)
    })
}
