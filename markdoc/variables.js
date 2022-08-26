import yaml from 'js-yaml';

const frontmatter = ast.attributes.frontmatter
  ? yaml.load(ast.attributes.frontmatter)
  : {};

const config = {
  variables: {
    frontmatter
  }
};