import React, { useMemo } from 'react'
import styled from '@emotion/styled'
import { motion } from 'framer-motion'

const Container = styled(motion.ul)`
  position: relative;
`

const HEIGHT = '100%'

const Panel = styled(motion.li)`
  position: absolute;
  width: 100%;
  height: ${HEIGHT};
  top: 0;
`

const ANIM_TRANS = {
  type: "tween",
}

interface Props {
  className?: string,
  active?: number,
}

const SlidingPanels: React.FunctionComponent<Props> = ({ className, children, active = 0 }) => {
  const numPanels = useMemo(() => {
    return React.Children.count(children)
  }, [ children ])

  const panelAnimVariants: Record<number, any> = useMemo(() => {
    let ret = []

    for (let i = 0; i < numPanels; i += 1) {
      let panelConfig: Record<string, any> = {}

      for (let j = 0; j < numPanels; j += 1) {
        panelConfig[`panel${j}`] = {
          left: `${(i - active) * 130}%`
        }
      }

      ret.push(panelConfig)
    }

    return ret
  }, [ active, numPanels ])

  return (
    <Container className={className} animate={`panel${active}`}>
      {React.Children.map(children, (child, idx) => (
        <Panel key={idx} initial={`panel${idx}`} variants={panelAnimVariants[idx]} transition={ANIM_TRANS}>
          {child}
        </Panel>
      ))}
    </Container>
  )
}

export default SlidingPanels