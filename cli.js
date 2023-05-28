import inquirer from 'inquirer';

export const askFileName = () => {
    const questions = [
        {
            name: 'filename',
            type: 'input',
            message: 'Enter the name of the file whose data you wish to generate:',
            validate: function( value ) {
                if (value.length && value.includes('.yaml')) {
                    return true;
                } else {
                    return 'Please, introduce a correct YAML file!';
                }
            }
        }
    ];
    return inquirer.prompt(questions);
}

export const askResource = (resourceList) => {
    const questions = [
        {
            name: 'resource',
            type: 'list',
            message: 'Select the entity for which you want to generate data:',
            choices: resourceList
        }
    ];
    return inquirer.prompt(questions);
};