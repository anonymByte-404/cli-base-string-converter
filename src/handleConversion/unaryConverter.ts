/**
 * Unary Conversion Module
 *
 * This module helps users convert unary data into different formats,
 * like text (strings) or other numeral systems.
 * It uses a simple menu to guide users through the conversion process.
 */

const choices: string[] = [
  'String',
  ...Array.from({ length: 63 }, (_, i) => `Base ${i + 2}`),
]

/**
 * Start the unary conversion process.
 *
 * Displays a menu where users can choose to convert unary data into text
 * or a numeral system. Handles user input and guides them through the steps.
 *
 * @param inquirer - The library for interactive menus and prompts.
 * @param main - Function to return to the main menu.
 * @param typewriterEffect - Function to display text with a typewriter effect.
 * @param fadeOutEffect - Function to fade out text with animation.
 */
export function unaryConverter(
  inquirer: any,
  main: () => void,
  typewriterEffect: (text: string, delay: number) => Promise<void>,
  fadeOutEffect: (text: string, steps: number, delay: number) => Promise<void>
): void {
  const startUnaryConversion = (): void => {
    inquirer
      .prompt([
        {
          type: 'list',
          name: 'selectedConversionBase',
          message: 'What format do you want to convert the unary data to?',
          choices: choices,
        },
      ])
      .then((answers: { selectedConversionBase: string }) => {
        switch (answers.selectedConversionBase) {
          case 'String':
            unaryToString(
              inquirer,
              startUnaryConversion,
              main,
              typewriterEffect,
              fadeOutEffect
            )
            break
          default: {
            const match = answers.selectedConversionBase.match(/Base (\d+)/)
            if (match) {
              const base = parseInt(match[1], 10)
              unaryToBase(
                inquirer,
                `Base ${base}`,
                base,
                startUnaryConversion,
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
                startUnaryConversion,
                main,
                typewriterEffect,
                fadeOutEffect
              )
            }
          }
        }
      })
      .catch((error: unknown) => {
        console.error(
          'Something went wrong while selecting a conversion option:',
          error
        )
      })
  }

  startUnaryConversion()
}

/**
 * Convert unary data into text.
 *
 * Asks the user to provide unary data, validates it, and converts it
 * into readable text (ASCII characters).
 *
 * @param inquirer - The library for interactive menus and prompts.
 * @param callback - Function to restart the unary conversion process.
 * @param main - Function to return to the main menu.
 * @param typewriterEffect - Function to display text with a typewriter effect.
 * @param fadeOutEffect - Function to fade out text with animation.
 */
function unaryToString(
  inquirer: any,
  callback: () => void,
  main: () => void,
  typewriterEffect: (text: string, delay: number) => Promise<void>,
  fadeOutEffect: (text: string, steps: number, delay: number) => Promise<void>
): void {
  const promptUnaryInput = (): void => {
    inquirer
      .prompt([
        {
          type: 'input',
          name: 'unaryInput',
          message:
            'Enter the unary data (separate groups with spaces, use | for 1):',
        },
      ])
      .then((answers: { unaryInput: string }) => {
        const unaryArray = answers.unaryInput.trim().split(' ')

        // Validate if all inputs are valid unary numbers (just the symbol |).
        if (!unaryArray.every((num) => /^[|]+$/i.test(num))) {
          console.log(
            'Invalid input. Please enter unary numbers (using only the | symbol).'
          )
          return promptUnaryInput()
        }

        // Convert unary numbers to text (count occurrences of | as digits).
        const result = unaryArray
          .map((num) => String.fromCharCode(num.length + 64)) // 'A' starts at 1 occurrence
          .join('')
        console.log(`Here is your text: "${result}"`)
        askNextAction(inquirer, callback, main, typewriterEffect, fadeOutEffect)
      })
      .catch((error: unknown) => {
        console.error('Error during conversion to text:', error)
      })
  }

  promptUnaryInput()
}

/**
 * Convert unary data into a different numeral system.
 *
 * Asks the user to provide unary data, validates it, and converts it into
 * the specified numeral system (e.g., Base 2, Base 8, Base 10, etc.).
 *
 * @param inquirer - The library for interactive menus and prompts.
 * @param name - A string describing the base format (e.g., "Base 16").
 * @param base - The numeric base to convert the unary data into.
 * @param callback - Function to restart the unary conversion process.
 * @param main - Function to return to the main menu.
 * @param typewriterEffect - Function to display text with a typewriter effect.
 * @param fadeOutEffect - Function to fade out text with animation.
 */
function unaryToBase(
  inquirer: any,
  name: string,
  base: number,
  callback: () => void,
  main: () => void,
  typewriterEffect: (text: string, delay: number) => Promise<void>,
  fadeOutEffect: (text: string, steps: number, delay: number) => Promise<void>
): void {
  const promptUnaryInput = (): void => {
    inquirer
      .prompt([
        {
          type: 'input',
          name: 'unaryInput',
          message: `Enter the unary data (separate groups with spaces) to convert to ${name}:`,
        },
      ])
      .then((answers: { unaryInput: string }) => {
        const unaryArray = answers.unaryInput.trim().split(' ')

        // Validate if all inputs are valid unary numbers (just the symbol |).
        if (!unaryArray.every((num) => /^[|]+$/i.test(num))) {
          console.log(
            'Invalid input. Please enter unary numbers (using only the | symbol).'
          )
          return promptUnaryInput()
        }

        // Convert unary numbers to the specified base (count occurrences of | as digits).
        const result = unaryArray
          .map((num) => num.length.toString(base))
          .join(' ')
        console.log(`Here is your converted data in ${name}: ${result}`)
        askNextAction(inquirer, callback, main, typewriterEffect, fadeOutEffect)
      })
      .catch((error: unknown) => {
        console.error(`Error during conversion to ${name}:`, error)
      })
  }

  promptUnaryInput()
}

/**
 * Ask the user what they want to do next after completing a conversion.
 *
 * Provides options to convert again, go back to the main menu, or quit the app.
 *
 * @param inquirer - The library for interactive menus and prompts.
 * @param callback - Function to restart the unary conversion process.
 * @param main - Function to return to the main menu.
 * @param typewriterEffect - Function to display text with a typewriter effect.
 * @param fadeOutEffect - Function to fade out text with animation.
 */
function askNextAction(
  inquirer: any,
  callback: () => void,
  main: () => void,
  typewriterEffect: (text: string, delay: number) => Promise<void>,
  fadeOutEffect: (text: string, steps: number, delay: number) => Promise<void>
): void {
  inquirer
    .prompt([
      {
        type: 'list',
        name: 'nextAction',
        message: 'What would you like to do next?',
        choices: [
          'Convert unary data again.',
          'Go back to the Main Menu.',
          'Exit the application.',
        ],
      },
    ])
    .then(async (answers: { nextAction: string }) => {
      switch (answers.nextAction) {
        case 'Convert unary data again.':
          callback()
          break
        case 'Go back to the Main Menu.':
          console.log('Returning to the Main Menu...')
          main()
          break
        case 'Exit the application.':
          await typewriterEffect('Thanks for using the app. Goodbye!', 50)
          await fadeOutEffect('Closing the application...', 10, 100)
          process.exit(0) // Exit the app
      }
    })
    .catch((error: unknown) => {
      console.error('Error while deciding the next action:', error)
    })
}
