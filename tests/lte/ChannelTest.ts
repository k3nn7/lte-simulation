import {expect} from 'chai';
import {spy} from 'sinon';
import {Channel} from "../../src/lte/Channel";
import {Packet} from "../../src/lte/Packet";
import {LogicalChannelType} from "../../src/lte/ChannelType";

describe('Channel', () => {
  let channel: Channel;

  beforeEach(() => {
    channel = new Channel(LogicalChannelType.BCCH);
  });

  it('should call down-link when packet is sent down', () => {
    // given
    const packet = new Packet(10);
    const onDownLink = spy();
    channel.setOnDownLink(onDownLink);

    // when
    channel.sendDown(packet);

    // then
    expect(onDownLink.calledOnceWith(packet, channel)).to.equal(true);
  });

  it('should call up-link when packet is sent up', () => {
    // given
    const packet = new Packet(10);
    const onUpLink = spy();
    channel.setOnUpLink(onUpLink);

    // when
    channel.sendUp(packet);

    // then
    expect(onUpLink.calledOnceWith(packet, channel)).to.equal(true);
  });

  it('should not crash if any callback is missing', () => {
    channel.sendDown(new Packet(10));
    channel.sendUp(new Packet(10));
  });
});
