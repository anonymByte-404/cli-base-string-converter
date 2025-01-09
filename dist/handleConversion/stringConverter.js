/**
 * String Conversion Module
 *
 * This module helps convert strings into various numeral systems
 * (e.g., binary, hexadecimal). It guides users through an interactive
 * menu to select their desired conversion format and processes the input accordingly.
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
 * Starts the string conversion process by providing a list of numeral systems.
 *
 * @param inquirer - The library used for interactive CLI prompts.
 * @param baseChoices - List of numeral systems (e.g., "Base 2", "Base 16").
 * @param main - Callback to return to the main menu.
 * @param typewriterEffect - Function for text typing animation.
 * @param fadeOutEffect - Function for text fade-out animation.
 */
export function stringConverter(
  inquirer,
  baseChoices,
  main,
  typewriterEffect,
  fadeOutEffect
) {
  const startStringConversion = () => {
    inquirer
      .prompt([
        {
          type: 'list',
          name: 'selectedBase',
          message: 'Select the base to convert your string to:',
          choices: baseChoices,
        },
      ])
      .then((answers) => {
        const match = answers.selectedBase.match(/Base (\d+)/)
        if (match) {
          const base = parseInt(match[1], 10)
          stringToBase(
            inquirer,
            `Base ${base}`,
            base,
            startStringConversion,
            main,
            typewriterEffect,
            fadeOutEffect
          )
        } else {
          console.log('Unsupported base. Please try another option.')
          askNextAction(
            inquirer,
            startStringConversion,
            main,
            typewriterEffect,
            fadeOutEffect
          )
        }
      })
      .catch((error) => {
        console.error('Error during base selection:', error)
      })
  }
  startStringConversion()
}
/**
 * Converts a string to a specified numeral system.
 *
 * Each character in the string is converted to its ASCII value, then
 * represented in the target numeral system with appropriate padding.
 *
 * @param inquirer - The library used for interactive CLI prompts.
 * @param name - Name of the numeral system (e.g., "Base 16").
 * @param base - The target numeral system (e.g., 16 for Base 16).
 * @param callback - Function to restart the string conversion process.
 * @param main - Callback to return to the main menu.
 */
function stringToBase(
  inquirer,
  name,
  base,
  callback,
  main,
  typewriterEffect,
  fadeOutEffect
) {
  inquirer
    .prompt([
      {
        type: 'input',
        name: 'stringInput',
        message: `Enter the string to convert to ${name}:`,
      },
    ])
    .then((answers) => {
      const inputString = answers.stringInput.trim()
      // Determine the maximum width for padding based on the base
      const maxWidth = Math.ceil(Math.log2(256) / Math.log2(base))
      // Convert each character to its ASCII representation in the target base
      const result = Array.from(inputString)
        .map((char) =>
          char.charCodeAt(0).toString(base).padStart(maxWidth, '0')
        )
        .join(' ')
      console.log(`Converted to ${name}: ${result}`)
      askNextAction(inquirer, callback, main, typewriterEffect, fadeOutEffect)
    })
    .catch((error) => {
      console.error(`Error during conversion to ${name}:`, error)
    })
}
/**
 * Handles the user's next steps after completing a conversion.
 *
 * Provides options to convert another string, return to the main menu, or exit.
 *
 * @param inquirer - The library used for interactive CLI prompts.
 * @param callback - Function to restart the string conversion process.
 * @param main - Callback to return to the main menu.
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
          'Convert another string.',
          'Return to Main Menu.',
          'Exit the application.',
        ],
      },
    ])
    .then((answers) =>
      __awaiter(this, void 0, void 0, function* () {
        switch (answers.nextAction) {
          case 'Convert another string.':
            callback()
            break
          case 'Return to Main Menu.':
            console.log('Returning to the main menu...')
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
      console.error('Error while deciding the next step:', error)
    })
}
