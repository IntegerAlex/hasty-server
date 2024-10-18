import * as React from 'react'
import { cva } from 'class-variance-authority'
import PropTypes from 'prop-types'
import { mergeClasses } from '../../lib/utils'

const typographyVariants = cva(' text-normal', {
  variants: {
    variant: {
      h1: 'text-4xl font-semibold md:font-bold md:text-5xl md:tracking-[-0.02em] lg:text-6xl lg:leading-[72px] ',
      h2: 'text-lg md:text-4xl font-semibold tracking-[-0.02em] ',
      h3: 'text-2xl md:text-3xl font-semibold tracking-[-0.02em] ',
      h4: 'text-xl md:text-2xl font-semibold tracking-[-0.02em] ',
      h5: 'text-lg md:text-xl font-semibold tracking-[-0.02em] ',
      h6: 'text-base md:text-lg font-semibold tracking-[-0.02em] ',
      subtitle: 'text-lg md:text-xl',
      body1: 'text-base md:text-lg',
      body2: 'text-base',
      body3: 'text-sm',
      caption: 'text-sm ',
      overline: 'text-xs  uppercase'
    }
  },
  defaultVariants: {
    variant: 'body2'
  }
})

const elementMapping = {
  h1: 'h1',
  h2: 'h2',
  h3: 'h3',
  h4: 'h4',
  h5: 'h5',
  h6: 'h6',
  subtitle: 'p',
  body1: 'p',
  body2: 'p',
  body3: 'p',
  caption: 'span',
  overline: 'span'
}

const Typography = React.forwardRef(
  ({ component, className = '', variant, children, ...props }, ref) => {
    const Comp = component || (variant
      ? elementMapping[variant]
      : 'p')

    return (
      <Comp
        className={mergeClasses(typographyVariants({ variant }), className)}
        ref={ref}
        {...props}
      >
        {children}
      </Comp>
    )
  }
)

Typography.displayName = 'Typography'

Typography.propTypes = {
  component: PropTypes.elementType,
  className: PropTypes.string,
  variant: PropTypes.oneOf([
    'h1',
    'h2',
    'h3',
    'h4',
    'h5',
    'h6',
    'subtitle',
    'body1',
    'body2',
    'body3',
    'caption',
    'overline'
  ]),
  children: PropTypes.node
}

export default Typography
