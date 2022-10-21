import { Callout } from '@/components/Callout'
import { Fence } from '@/components/Fence'
import { InlineCode } from '@/components/InlineCode'
import { nodes as defaultNodes } from '@markdoc/markdoc'

const nodes = {
  document: {
    render: undefined,
  },
  th: {
    ...defaultNodes.th,
    attributes: {
      ...defaultNodes.th.attributes,
      scope: {
        type: String,
        default: 'col',
      },
    },
  },
  fence: {
    render: Fence,
    attributes: {
      language: {
        type: String,
      },
    },
  },
  code: {
    render: InlineCode,
  	attributes: {
  		content: {
  			type: String
  		}
  	}
  },
  blockquote: {
  	render: Callout,
  	attributes: {
  		type: {
  			type: String
  		},
  		title: {
  			type: String
  		}
  	}
  }
}

export default nodes
