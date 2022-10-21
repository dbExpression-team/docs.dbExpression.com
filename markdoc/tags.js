import { Accordian } from '@/components/Accordian'
import { Collapsable } from '@/components/Collapsable'
import { Callout } from '@/components/Callout'
import { QuickLinks, QuickLink } from '@/components/QuickLinks'

import { CoreConcepts } from '@/components/CoreConcepts'
import { CodeExample } from '@/components/CodeExample'
import { OffsiteUrl } from '@/components/OffsiteUrl'
import { MicrosoftDocsUrl } from '@/components/MicrosoftDocsUrl'
import { QueryExpressionPartDefinition } from '@/components/QueryExpressionPartDefinition'
import { SupportedVersionList } from '@/components/SupportedVersionList'
import { ExecutionPipelineImage } from '@/components/ExecutionPipelineImage'
import { QueryExecutionSequenceImage } from '@/components/QueryExecutionSequenceImage'
import { MethodDescriptor } from '@/components/MethodDescriptor'

const tags = {
  accordian: {
    attributes: {
      caption: { type: String }
    },
    render: Accordian,
  },
  callout: {
    attributes: {
      title: { type: String },
      type: {
        type: String,
        default: 'note',
        matches: ['note', 'warning'],
        errorLevel: 'critical',
      },
    },
    render: Callout,
  },
  figure: {
    selfClosing: true,
    attributes: {
      src: { type: String },
      alt: { type: String },
      caption: { type: String },
    },
    render: ({ src, alt = '', caption }) => (
      <figure>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={src} alt={alt} />
        <figcaption>{caption}</figcaption>
      </figure>
    ),
  },
  'quick-links': {
    render: QuickLinks,
  },
  'quick-link': {
    selfClosing: true,
    render: QuickLink,
    attributes: {
      title: { type: String },
      description: { type: String },
      icon: { type: String },
      href: { type: String },
    },
  },
  collapsable: {
	  selfClosing: true,
	  render: Collapsable,
	  attributes : {
		  title: { type: String }
	  }
  },
  'code-example': {
    selfClosing: false,
    render: CodeExample,
	  attributes : {
		  labels: { 
        type: Array,
        default: ['C#', 'SQL']
      }
	  }
  },
  'offsite-url': {
    selfClosing: true,
    render: OffsiteUrl,
	  attributes : {
		  url: { 
        type: String
      },
      label: { 
        type: String,
        required: true
      }
	  }
  },
  'ms-docs-url': {
    selfClosing: true,
    render: MicrosoftDocsUrl,
	  attributes : {
		  path: { 
        type: String
      },
      label: { 
        type: String,
        required: true
      }
	  }
  },
  'supported-versions': {
    selfClosing: true,
    render: SupportedVersionList,
	  attributes : {
		  versions: { 
        type: Array
      },
      initial_version: { 
        type: String
      },
      listAll : {
        type: Boolean,
        default: true
      }
	  }
  },
  'query-expression-part-definition': {
    selfClosing: true,
    render: QueryExpressionPartDefinition
  },
  'query-execution-sequence-image': {
    render: QueryExecutionSequenceImage,
	  attributes : {
		  highlight: { 
        type: String
      }
	  }
  },
  'execution-pipeline-image': {
    selfClosing: true,
    render: ExecutionPipelineImage,
	  attributes : {
		  type: { 
        type: String
      }
	  }
  },
  'core-concepts': {
    render: CoreConcepts,
	  attributes : {
		  caption: { 
        type: String
      }
	  }
  },
  'method-descriptor': {
    render: MethodDescriptor
  },
}

export default tags
