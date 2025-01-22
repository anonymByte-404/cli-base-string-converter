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
import inquirer from 'inquirer'
import chalk from 'chalk'
import { stringConverter } from './handleConversion/stringConverter.js'
import { universalBaseConverter } from './handleConversion/universalBaseConverter.js'
import { typewriterEffect, fadeOutEffect } from './utils/textAnimation.js'
import {
  loadHistory,
  clearHistory,
  deleteHistoryEntry,
} from './storage/historyManager.js'
const baseChoices = Array.from({ length: 64 }, (_, i) => `Base ${i + 1}`)
/**
 * Handles viewing, clearing, and deleting specific entries in the conversion history.
 *
 * @returns {Promise<void>} A promise that resolves when the history has been viewed, cleared, or modified.
 */
const handleHistory = () =>
  __awaiter(void 0, void 0, void 0, function* () {
    const history = loadHistory()
    if (history.length === 0) {
      console.log(chalk.yellow('No conversion history available.'))
      yield typewriterEffect('Returning to main menu...', 50)
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
    const { action } = yield inquirer.prompt([
      {
        type: 'list',
        name: 'action',
        message: 'What would you like to do?',
        choices: [
          'Return to Main Menu',
          'Clear History',
          'Delete Specific Entry',
        ],
      },
    ])
    if (action === 'Clear History') {
      clearHistory()
      console.log(chalk.red('History cleared successfully!'))
      yield typewriterEffect('Returning to main menu...', 50)
      main()
    } else if (action === 'Return to Main Menu') {
      yield typewriterEffect('Returning to main menu...', 50)
      main()
    } else if (action === 'Delete Specific Entry') {
      const { indexToDelete } = yield inquirer.prompt([
        {
          type: 'input',
          name: 'indexToDelete',
          message: 'Enter the number of the entry you want to delete:',
          validate: (input) => {
            const index = parseInt(input, 10)
            if (isNaN(index) || index < 1 || index > history.length) {
              return 'Please enter a valid number corresponding to a history entry.'
            }
            return true
          },
        },
      ])
      deleteHistoryEntry(parseInt(indexToDelete, 10) - 1)
      yield typewriterEffect(
        'Entry deleted. Would you like to delete another?',
        50
      )
      handleHistory()
    }
  })
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
const main = () => {
  inquirer
    .prompt([
      {
        type: 'list',
        name: 'conversionType',
        message: 'Welcome! What kind of conversion would you like to do?',
        choices: ['String', 'Base', 'View History', 'Exit the application'],
      },
    ])
    .then((answers) =>
      __awaiter(void 0, void 0, void 0, function* () {
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
            .then((answers) =>
              __awaiter(void 0, void 0, void 0, function* () {
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
                  yield typewriterEffect(
                    'Thanks for using the app. Goodbye!',
                    50
                  )
                  yield fadeOutEffect('Closing the application...', 10, 100)
                  process.exit(0)
                }
              })
            )
            .catch((error) => {
              console.error(
                chalk.red(
                  'Oops! Something went wrong while selecting a base:',
                  error
                )
              )
            })
        } else if (answers.conversionType === 'View History') {
          yield handleHistory()
        } else if (answers.conversionType === 'Exit the application') {
          yield typewriterEffect('Thanks for using the app. Goodbye!', 50)
          yield fadeOutEffect('Closing the application...', 10, 100)
          process.exit(0)
        }
      })
    )
    .catch((error) => {
      console.error(chalk.red('Oops! Something unexpected happened:', error))
    })
}
// Start the program
main()
