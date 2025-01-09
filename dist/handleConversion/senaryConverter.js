/**
 * Senary Conversion Module
 *
 * This module helps users convert senary data into different formats,
 * like text (strings) or numeral systems (Base 6 to Base 64).
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
  ...Array.from({ length: 59 }, (_, i) => `Base ${i + 6}`),
]
/**
 * Start the senary conversion process.
 *
 * Displays a menu where users can choose to convert senary data into text
 * or a numeral system. Handles user input and guides them through the steps.
 *
 * @param inquirer - The library for interactive menus and prompts.
 * @param main - Function to return to the main menu.
 * @param typewriterEffect - Function for text typing animation.
 * @param fadeOutEffect - Function for text fade-out animation.
 */
export function senaryConverter(
  inquirer,
  main,
  typewriterEffect,
  fadeOutEffect
) {
  const startSenaryConversion = () => {
    inquirer
      .prompt([
        {
          type: 'list',
          name: 'selectedConversionBase',
          message: 'What format do you want to convert the senary data to?',
          choices: choices,
        },
      ])
      .then((answers) => {
        switch (answers.selectedConversionBase) {
          case 'String':
            senaryToString(
              inquirer,
              startSenaryConversion,
              main,
              typewriterEffect,
              fadeOutEffect
            )
            break
          default: {
            const match = answers.selectedConversionBase.match(/Base (\d+)/)
            if (match) {
              const base = parseInt(match[1], 10)
              senaryToBase(
                inquirer,
                `Base ${base}`,
                base,
                startSenaryConversion,
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
                startSenaryConversion,
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
  startSenaryConversion()
}
/**
 * Convert senary data into text.
 *
 * Asks the user to provide senary data, validates it, and converts it
 * into readable text (ASCII characters).
 *
 * @param inquirer - The library for interactive menus and prompts.
 * @param callback - Function to restart the senary conversion process.
 * @param main - Function to return to the main menu.
 */
function senaryToString(
  inquirer,
  callback,
  main,
  typewriterEffect,
  fadeOutEffect
) {
  const promptSenaryInput = () => {
    inquirer
      .prompt([
        {
          type: 'input',
          name: 'senaryInput',
          message: 'Enter the senary data (separate groups with spaces):',
        },
      ])
      .then((answers) => {
        const senaryArray = answers.senaryInput.trim().split(' ')
        // Check if all inputs are valid senary numbers (0-5).
        if (!senaryArray.every((sen) => /^[0-5]+$/.test(sen))) {
          console.log('Invalid input. Please enter senary numbers (only 0-5).')
          return promptSenaryInput()
        }
        // Convert senary numbers to text.
        const result = senaryArray
          .map((sen) => String.fromCharCode(parseInt(sen, 6)))
          .join('')
        console.log(`Here is your text: "${result}"`)
        askNextAction(inquirer, callback, main, typewriterEffect, fadeOutEffect)
      })
      .catch((error) => {
        console.error('Error during conversion to text:', error)
      })
  }
  promptSenaryInput()
}
/**
 * Convert senary data into a different numeral system.
 *
 * Asks the user to provide senary data, validates it, and converts it into
 * the specified numeral system (e.g., Base 6, Base 16, etc.).
 *
 * @param inquirer - The library for interactive menus and prompts.
 * @param name - The name of the numeral system (e.g., "Base 6").
 * @param base - The numeral system's base (e.g., 6 for Base 6).
 * @param callback - Function to restart the senary conversion process.
 * @param main - Function to return to the main menu.
 */
function senaryToBase(
  inquirer,
  name,
  base,
  callback,
  main,
  typewriterEffect,
  fadeOutEffect
) {
  const promptSenaryInput = () => {
    inquirer
      .prompt([
        {
          type: 'input',
          name: 'senaryInput',
          message: `Enter the senary data (separate groups with spaces) to convert to ${name}:`,
        },
      ])
      .then((answers) => {
        const senaryArray = answers.senaryInput.trim().split(' ')
        // Check if all inputs are valid senary numbers (0-5).
        if (!senaryArray.every((sen) => /^[0-5]+$/.test(sen))) {
          console.log('Invalid input. Please enter senary numbers (only 0-5).')
          return promptSenaryInput()
        }
        // Convert senary numbers to the specified base.
        const result = senaryArray
          .map((sen) => parseInt(sen, 6).toString(base))
          .join(' ')
        console.log(`Here is your converted data in ${name}: ${result}`)
        askNextAction(inquirer, callback, main, typewriterEffect, fadeOutEffect)
      })
      .catch((error) => {
        console.error(`Error during conversion to ${name}:`, error)
      })
  }
  promptSenaryInput()
}
/**
 * Ask the user what they want to do next after completing a conversion.
 *
 * Provides options to convert again, go back to the main menu, or quit the app.
 *
 * @param inquirer - The library for interactive menus and prompts.
 * @param callback - Function to restart the senary conversion process.
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
          'Convert senary data again.',
          'Go back to the Main Menu.',
          'Exit the application.',
        ],
      },
    ])
    .then((answers) =>
      __awaiter(this, void 0, void 0, function* () {
        switch (answers.nextAction) {
          case 'Convert senary data again.':
            callback()
            break
          case 'Go back to the Main Menu.':
            console.log('Returning to the Main Menu...')
            main()
            break
          case 'Exit the application.':
            // Typing animation. You can adjust the delay (default: 50ms) for faster/slower typing.
            yield typewriterEffect('Thanks for using the app. Goodbye!', 50)
            // Fade-out animation. You can adjust the fade steps (default: 10) and delay (default: 100ms) for different effects.
            yield fadeOutEffect('Closing the application...', 10, 100)
            process.exit(0) // Exit the app
        }
      })
    )
    .catch((error) => {
      console.error('Error while deciding the next action:', error)
    })
}
