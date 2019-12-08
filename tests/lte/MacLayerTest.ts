import {expect} from 'chai';
import {MacLayer} from "../../src/lte/MacLayer";
import {LogicalChannelType, TransportChannelType} from "../../src/lte/ChannelType";
import {TransmitPacketDownLink} from "../../src/lte/Action";

describe('MacLayer', () => {
  let macLayer: MacLayer;

  beforeEach(() => {
    macLayer = new MacLayer();
  });

  it('should have no bits in up-link and down-link channels at the beginning', () => {
    const expectedUpLinkBits = new Map<LogicalChannelType, number>();
    expectedUpLinkBits.set(LogicalChannelType.PCCH, 0);
    expectedUpLinkBits.set(LogicalChannelType.BCCH, 0);
    expectedUpLinkBits.set(LogicalChannelType.CCCH, 0);
    expectedUpLinkBits.set(LogicalChannelType.DCCH, 0);
    expectedUpLinkBits.set(LogicalChannelType.DTCH, 0);
    expectedUpLinkBits.set(LogicalChannelType.MCCH, 0);
    expectedUpLinkBits.set(LogicalChannelType.MTCH, 0);

    const expectedDownLinkBits = new Map<TransportChannelType, number>();
    expectedDownLinkBits.set(TransportChannelType.PCH, 0);
    expectedDownLinkBits.set(TransportChannelType.BCH, 0);
    expectedDownLinkBits.set(TransportChannelType.DL_SCH, 0);
    expectedDownLinkBits.set(TransportChannelType.MCH, 0);

    expect(macLayer.peekUpLink()).to.be.deep.equal(expectedUpLinkBits);
    expect(macLayer.peekDownLink()).to.be.deep.equal(expectedDownLinkBits);
  });

  it('should have down-link transmission not finished at the beginning', () => {
    expect(macLayer.isDownLinkFinished()).to.be.equal(false);
  });

  it('should allow to peek packets sent to up-link channels', () => {
    // given
    const expectedBits = new Map<LogicalChannelType, number>();
    expectedBits.set(LogicalChannelType.PCCH, 5);
    expectedBits.set(LogicalChannelType.BCCH, 10);
    expectedBits.set(LogicalChannelType.CCCH, 7);
    expectedBits.set(LogicalChannelType.DCCH, 3);
    expectedBits.set(LogicalChannelType.DTCH, 8);
    expectedBits.set(LogicalChannelType.MCCH, 2);
    expectedBits.set(LogicalChannelType.MTCH, 6);

    // when
    macLayer.sendViaUpLink(LogicalChannelType.PCCH, 5);
    macLayer.sendViaUpLink(LogicalChannelType.BCCH, 10);
    macLayer.sendViaUpLink(LogicalChannelType.CCCH, 7);
    macLayer.sendViaUpLink(LogicalChannelType.DCCH, 3);
    macLayer.sendViaUpLink(LogicalChannelType.DTCH, 8);
    macLayer.sendViaUpLink(LogicalChannelType.MCCH, 2);
    macLayer.sendViaUpLink(LogicalChannelType.MTCH, 6);

    // then
    expect(macLayer.peekUpLink()).to.be.deep.equal(expectedBits);
  });

  it('should allow to peek packets sent to down-link channels', () => {
    // given
    const expectedBits = new Map<TransportChannelType, number>();
    expectedBits.set(TransportChannelType.PCH, 3);
    expectedBits.set(TransportChannelType.BCH, 1);
    expectedBits.set(TransportChannelType.DL_SCH, 5);
    expectedBits.set(TransportChannelType.MCH, 9);

    // when
    macLayer.sendViaDownLink(TransportChannelType.PCH, 3);
    macLayer.sendViaDownLink(TransportChannelType.BCH, 1);
    macLayer.sendViaDownLink(TransportChannelType.DL_SCH, 5);
    macLayer.sendViaDownLink(TransportChannelType.MCH, 9);

    // then
    expect(macLayer.peekDownLink()).to.be.deep.equal(expectedBits);
  });

  it('should allow to fetch bits from any channel', () => {
    // given
    let fetchedBits: number;
    macLayer.sendViaDownLink(TransportChannelType.PCH, 10);
    macLayer.sendViaUpLink(LogicalChannelType.PCCH, 8);

    // when
    fetchedBits = macLayer.fetchFromDownLink(TransportChannelType.PCH, 8);

    // then
    expect(fetchedBits).to.be.equal(8);
    expect(macLayer.peekDownLink().get(TransportChannelType.PCH)).to.be.equal(2);

    // and when
    fetchedBits = macLayer.fetchFromDownLink(TransportChannelType.PCH, 8);

    // then
    expect(fetchedBits).to.be.equal(2);
    expect(macLayer.peekDownLink().get(TransportChannelType.PCH)).to.be.equal(0);

    // and when
    fetchedBits = macLayer.fetchFromUpLink(LogicalChannelType.PCCH, 6);

    // then
    expect(fetchedBits).to.be.equal(6);
    expect(macLayer.peekUpLink().get(LogicalChannelType.PCCH)).to.be.equal(2);

    // and when
    fetchedBits = macLayer.fetchFromUpLink(LogicalChannelType.PCCH, 6);

    // then
    expect(fetchedBits).to.be.equal(2);
    expect(macLayer.peekUpLink().get(LogicalChannelType.PCCH)).to.be.equal(0);
  });

  it('should send up to PBR bits from every logical channel to transport channel in priority order during 1st stage', () => {
    // given
    macLayer.setChannelsPriorities([
      LogicalChannelType.PCCH,
      LogicalChannelType.BCCH,
      LogicalChannelType.CCCH,
      LogicalChannelType.DCCH,
      LogicalChannelType.DTCH,
      LogicalChannelType.MCCH,
      LogicalChannelType.MTCH,
    ]);

    macLayer.setChannelPBR(LogicalChannelType.PCCH, 2);
    macLayer.setChannelPBR(LogicalChannelType.BCCH, 3);
    macLayer.setChannelPBR(LogicalChannelType.CCCH, 4);
    macLayer.setChannelPBR(LogicalChannelType.DCCH, 1);
    macLayer.setChannelPBR(LogicalChannelType.DTCH, 6);
    macLayer.setChannelPBR(LogicalChannelType.MCCH, 1);
    macLayer.setChannelPBR(LogicalChannelType.MTCH, 3);

    macLayer.setMaxPDU(30);

    const expectedUpLinkBits = new Map<LogicalChannelType, number>();
    expectedUpLinkBits.set(LogicalChannelType.PCCH, 5);
    expectedUpLinkBits.set(LogicalChannelType.BCCH, 10);
    expectedUpLinkBits.set(LogicalChannelType.CCCH, 7);
    expectedUpLinkBits.set(LogicalChannelType.DCCH, 3);
    expectedUpLinkBits.set(LogicalChannelType.DTCH, 8);
    expectedUpLinkBits.set(LogicalChannelType.MCCH, 2);
    expectedUpLinkBits.set(LogicalChannelType.MTCH, 6);

    const expectedDownLinkBits = new Map<TransportChannelType, number>();
    expectedDownLinkBits.set(TransportChannelType.PCH, 0);
    expectedDownLinkBits.set(TransportChannelType.BCH, 0);
    expectedDownLinkBits.set(TransportChannelType.DL_SCH, 0);
    expectedDownLinkBits.set(TransportChannelType.MCH, 0);

    macLayer.sendViaUpLink(LogicalChannelType.PCCH, 5);
    macLayer.sendViaUpLink(LogicalChannelType.BCCH, 10);
    macLayer.sendViaUpLink(LogicalChannelType.CCCH, 7);
    macLayer.sendViaUpLink(LogicalChannelType.DCCH, 3);
    macLayer.sendViaUpLink(LogicalChannelType.DTCH, 8);
    macLayer.sendViaUpLink(LogicalChannelType.MCCH, 2);
    macLayer.sendViaUpLink(LogicalChannelType.MTCH, 6);

    // when
    macLayer.doDownLinkStep();

    // then
    expectedUpLinkBits.set(LogicalChannelType.PCCH, 3);
    expectedDownLinkBits.set(TransportChannelType.PCH, 2);


    expect(macLayer.peekUpLink()).to.be.deep.equal(expectedUpLinkBits);
    expect(macLayer.peekDownLink()).to.be.deep.equal(expectedDownLinkBits);
    expect(macLayer.getLastAction()).to.be.deep.equal(
      new TransmitPacketDownLink(LogicalChannelType.PCCH, TransportChannelType.PCH, 2)
    );

    // and when
    macLayer.doDownLinkStep();

    // then
    expectedUpLinkBits.set(LogicalChannelType.BCCH, 7);
    expectedDownLinkBits.set(TransportChannelType.BCH, 3);

    expect(macLayer.peekUpLink()).to.be.deep.equal(expectedUpLinkBits);
    expect(macLayer.peekDownLink()).to.be.deep.equal(expectedDownLinkBits);

    // and when
    macLayer.doDownLinkStep();
    macLayer.doDownLinkStep();
    macLayer.doDownLinkStep();
    macLayer.doDownLinkStep();
    macLayer.doDownLinkStep();

    // then
    expectedUpLinkBits.set(LogicalChannelType.CCCH, 3);
    expectedUpLinkBits.set(LogicalChannelType.DCCH, 2);
    expectedUpLinkBits.set(LogicalChannelType.DTCH, 2);
    expectedUpLinkBits.set(LogicalChannelType.MCCH, 1);
    expectedUpLinkBits.set(LogicalChannelType.MTCH, 3);

    expectedDownLinkBits.set(TransportChannelType.DL_SCH, 12);
    expectedDownLinkBits.set(TransportChannelType.MCH, 3);

    expect(macLayer.peekUpLink()).to.be.deep.equal(expectedUpLinkBits);
    expect(macLayer.peekDownLink()).to.be.deep.equal(expectedDownLinkBits);

    // and when
    macLayer.doDownLinkStep();

    // then
    expectedUpLinkBits.set(LogicalChannelType.PCCH, 0);
    expectedDownLinkBits.set(TransportChannelType.PCH, 5);

    expect(macLayer.peekUpLink()).to.be.deep.equal(expectedUpLinkBits);
    expect(macLayer.peekDownLink()).to.be.deep.equal(expectedDownLinkBits);
    expect(macLayer.getLastAction()).to.be.deep.equal(
      new TransmitPacketDownLink(LogicalChannelType.PCCH, TransportChannelType.PCH, 3)
    );

    // and when
    macLayer.doDownLinkStep();

    // then
    expectedUpLinkBits.set(LogicalChannelType.BCCH, 0);
    expectedDownLinkBits.set(TransportChannelType.BCH, 10);

    expect(macLayer.peekUpLink()).to.be.deep.equal(expectedUpLinkBits);
    expect(macLayer.peekDownLink()).to.be.deep.equal(expectedDownLinkBits);

    // and when
    macLayer.doDownLinkStep();

    // then
    expect(macLayer.peekUpLink()).to.be.deep.equal(expectedUpLinkBits);
    expect(macLayer.peekDownLink()).to.be.deep.equal(expectedDownLinkBits);
  });

  it('should finish down-link transmission after sending max PDU bits', () => {
    // given
    macLayer.setMaxPDU(10);
    macLayer.setChannelPBR(LogicalChannelType.PCCH, 20);
    macLayer.setChannelsPriorities([LogicalChannelType.PCCH]);
    macLayer.sendViaUpLink(LogicalChannelType.PCCH, 20);

    // when
    macLayer.doDownLinkStep();

    // then
    expect(macLayer.isDownLinkFinished()).to.be.equal(true);
  });

  it('should finish after draining up-link channels', () => {
    // given
    macLayer.setMaxPDU(100);
    macLayer.setChannelPBR(LogicalChannelType.PCCH, 20);
    macLayer.setChannelsPriorities([LogicalChannelType.PCCH]);
    macLayer.sendViaUpLink(LogicalChannelType.PCCH, 20);

    // when
    macLayer.doDownLinkStep();

    // then
    expect(macLayer.isDownLinkFinished()).to.be.equal(true);
  });
});
