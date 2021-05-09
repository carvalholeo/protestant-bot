// @ts-check

const DefaultController = {
  methodNotAllowed: async (request, response) => {
    return response
        .status(405)
        .json({message: `This method isn\'t allowed.
  See the docs and try another method to this route.`});
  },
};

module.exports = DefaultController;
