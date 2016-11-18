const path =require('path');

module.exports = {
    BASE_GIT_PATH:'git+ssh://git@git.2b6.me:qbs/qbs-cli.git',
    QBS_FRAMEWORK_PATH:path.join(__dirname, '../framework'),
    BASE_TEMPLATE_GIT_PATH:'git+ssh://git@git.2b6.me:qbs/qbs-template.git'
}