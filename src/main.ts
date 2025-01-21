import inquirer from 'inquirer'
import chalk from 'chalk'
import { stringConverter } from './handleConversion/stringConverter.js'
import { universalBaseConverter } from './handleConversion/universalBaseConverter.js'
import { typewriterEffect, fadeOutEffect } from './utils/textAnimation.js'
import { loadHistory, clearHistory } from './storage/historyManager.js'

const baseChoices: string[] = Array.from(
  { length: 64 },
  (_, i) => `Base ${i + 1}`
)

/**
 * Handles viewing and clearing the conversion history.
 *
 * @returns {Promise<void>} A promise that resolves when the history has been viewed or cleared.
 */
const handleHistory = async (): Promise<void> => {
  const history = loadHistory()

  if (history.length === 0) {
    console.log(chalk.yellow('No conversion history available.'))
    await typewriterEffect('Returning to main menu...', 50)
    main()
    return
  }

  console.log(chalk.green('Conversion History:'))
  history.forEach((entry, index) => {
    console.log(
      chalk.blueBright(
        `${index + 1}. [${entry.date}] (${entry.type})\n   - Input: "${entry.input}"\n   - Output: "${entry.output}"\n`
      )
    )
  })

  const { action } = await inquirer.prompt([
    {
      type: 'list',
      name: 'action',
      message: 'What would you like to do?',
      choices: ['Return to Main Menu', 'Clear History'],
    },
  ])

  if (action === 'Clear History') {
    clearHistory()
    console.log(chalk.red('History cleared successfully!'))
    await typewriterEffect('Returning to main menu...', 50)
    main()
  } else if (action === 'Return to Main Menu') {
    await typewriterEffect('Returning to main menu...', 50)
    main()
  }
}

/**
 * Main menu for the application.
 *
 * Prompts the user to select an action:
 * - Perform a string conversion
 * - Perform a base-to-base conversion
 * - View the history of conversions
 * - Exit the application
 *
 * @returns {void}
 */
const main = (): void => {
  inquirer
    .prompt([
      {
        type: 'list',
        name: 'conversionType',
        message: 'Welcome! What kind of conversion would you like to do?',
        choices: ['String', 'Base', 'View History', 'Exit the application'],
      },
    ])
    .then(async (answers: { conversionType: string }) => {
      if (answers.conversionType === 'String') {
        stringConverter(
          inquirer,
          baseChoices,
          main,
          typewriterEffect,
          fadeOutEffect,
          chalk
        )
      } else if (answers.conversionType === 'Base') {
        inquirer
          .prompt([
            {
              type: 'list',
              name: 'selectedBase',
              message: 'Choose the base you want to convert to:',
              choices: [...baseChoices, 'Exit the application'],
            },
          ])
          .then(async (answers: { selectedBase: string }) => {
            if (answers.selectedBase !== 'Exit the application') {
              const baseMatch = answers.selectedBase.match(/Base (\d+)/)
              if (baseMatch) {
                const selectedBase = parseInt(baseMatch[1], 10)
                return universalBaseConverter(
                  inquirer,
                  main,
                  typewriterEffect,
                  fadeOutEffect,
                  chalk,
                  selectedBase
                )
              } else {
                console.error(
                  chalk.red('Invalid base selection. Please try again.')
                )
              }
            } else {
              await typewriterEffect('Thanks for using the app. Goodbye!', 50)
              await fadeOutEffect('Closing the application...', 10, 100)
              process.exit(0)
            }
          })
          .catch((error: unknown) => {
            console.error(
              chalk.red(
                'Oops! Something went wrong while selecting a base:',
                error
              )
            )
          })
      } else if (answers.conversionType === 'View History') {
        await handleHistory()
      } else if (answers.conversionType === 'Exit the application') {
        await typewriterEffect('Thanks for using the app. Goodbye!', 50)
        await fadeOutEffect('Closing the application...', 10, 100)
        process.exit(0)
      }
    })
    .catch((error: unknown) => {
      console.error(chalk.red('Oops! Something unexpected happened:', error))
    })
}

// Start the program
main()
