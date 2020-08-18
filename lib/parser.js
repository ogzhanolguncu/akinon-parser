const request = require('request');
const parser = require('node-html-parser');
const fileSystem = require('fs');
const argv = require('minimist')(process.argv.slice(2));

exports.parseContract = function () {
  request({ uri: argv.url }, function (error, response, body) {
    const htmlBody = parser.parse(body);
    const modalBody = htmlBody.querySelector(argv.modalBody); // .contract
    const titleAndDescription = modalBody.querySelectorAll(argv.container).reduce(
      (acc, current) => [
        ...acc,
        {
          text: current.querySelector(argv.title).innerHTML,
          style: { ...styles.title },
        },
        {
          text: current
            .querySelectorAll(argv.desc)
            .map((desc) => desc.innerHTML.trim())
            .toString(),
          style: { ...styles.paragraph },
        },
      ],
      [],
    );
    const parsedDatas = JSON.stringify({ titleAndDescription });
    fileSystem.writeFile('contract.json', parsedDatas, (err) => {
      if (err) {
        throw err;
      }
      console.log('Data has been written to file successfully.');
    });
  });

  const styles = {
    paragraph: {
      wrapperStyle: {
        padding: 10,
      },
      textStyle: {
        size: 'h5',
      },
    },
    title: {
      wrapperStyle: {
        marginLeft: 10,
      },
      textStyle: {
        size: 'h3',
        bold: true,
      },
    },
  };
};
