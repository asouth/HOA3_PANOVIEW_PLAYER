"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.fuma2acn = exports.n3d2sn3d = exports.sn3d2n3d = exports.acn2wxyz = exports.wxyz2acn = undefined;

var _classCallCheck2 = require("babel-runtime/helpers/classCallCheck");

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

////////////////////////////////////////////////////////////////////
//  Archontis Politis
//  archontis.politis@aalto.fi
//  David Poirier-Quinot
//  davipoir@ircam.fr
////////////////////////////////////////////////////////////////////
//
//  JSAmbisonics a JavaScript library for higher-order Ambisonics
//  The library implements Web Audio blocks that perform
//  typical ambisonic processing operations on audio signals.
//
////////////////////////////////////////////////////////////////////

///////////////////////////////////
/* FOA B-FORMAT TO ACN/N3D CONVERTER */
///////////////////////////////////
var wxyz2acn = exports.wxyz2acn = function wxyz2acn(audioCtx) {
    (0, _classCallCheck3.default)(this, wxyz2acn);


    this.ctx = audioCtx;
    this.in = this.ctx.createChannelSplitter(4);
    this.out = this.ctx.createChannelMerger(4);
    this.gains = new Array(4);

    for (var i = 0; i < 4; i++) {
        this.gains[i] = this.ctx.createGain();
        if (i == 0) this.gains[i].gain.value = Math.SQRT2;else this.gains[i].gain.value = Math.sqrt(3);

        this.gains[i].connect(this.out, 0, i);
    }
    this.in.connect(this.gains[0], 0, 0);
    this.in.connect(this.gains[3], 1, 0);
    this.in.connect(this.gains[1], 2, 0);
    this.in.connect(this.gains[2], 3, 0);
};

///////////////////////////////////
/* ACN/N3D TO FOA B-FORMAT CONVERTER */
///////////////////////////////////


var acn2wxyz = exports.acn2wxyz = function acn2wxyz(audioCtx) {
    (0, _classCallCheck3.default)(this, acn2wxyz);


    this.ctx = audioCtx;
    this.in = this.ctx.createChannelSplitter(4);
    this.out = this.ctx.createChannelMerger(4);
    this.gains = new Array(4);

    for (var i = 0; i < 4; i++) {
        this.gains[i] = this.ctx.createGain();
        if (i == 0) this.gains[i].gain.value = Math.SQRT1_2;else this.gains[i].gain.value = 1 / Math.sqrt(3);

        this.gains[i].connect(this.out, 0, i);
    }
    this.in.connect(this.gains[0], 0, 0);
    this.in.connect(this.gains[2], 1, 0);
    this.in.connect(this.gains[3], 2, 0);
    this.in.connect(this.gains[1], 3, 0);
};

///////////////////////////////////
/* ACN/SN3D TO ACN/N3D CONVERTER */
///////////////////////////////////


var sn3d2n3d = exports.sn3d2n3d = function sn3d2n3d(audioCtx, order) {
    (0, _classCallCheck3.default)(this, sn3d2n3d);


    this.ctx = audioCtx;
    this.order = order;
    this.nCh = (order + 1) * (order + 1);
    this.in = this.ctx.createChannelSplitter(this.nCh);
    this.out = this.ctx.createChannelMerger(this.nCh);
    this.gains = new Array(this.nCh);

    for (var i = 0; i < this.nCh; i++) {
        var n = Math.floor(Math.sqrt(i));

        this.gains[i] = this.ctx.createGain();
        this.gains[i].gain.value = Math.sqrt(2 * n + 1);

        this.in.connect(this.gains[i], i, 0);
        this.gains[i].connect(this.out, 0, i);
    }
};

///////////////////////////////////
/* ACN/N3D TO ACN/SN3D CONVERTER */
///////////////////////////////////


var n3d2sn3d = exports.n3d2sn3d = function n3d2sn3d(audioCtx, order) {
    (0, _classCallCheck3.default)(this, n3d2sn3d);


    this.ctx = audioCtx;
    this.order = order;
    this.nCh = (order + 1) * (order + 1);
    this.in = this.ctx.createChannelSplitter(this.nCh);
    this.out = this.ctx.createChannelMerger(this.nCh);
    this.gains = new Array(this.nCh);

    for (var i = 0; i < this.nCh; i++) {
        var n = Math.floor(Math.sqrt(i));

        this.gains[i] = this.ctx.createGain();
        this.gains[i].gain.value = 1 / Math.sqrt(2 * n + 1);

        this.in.connect(this.gains[i], i, 0);
        this.gains[i].connect(this.out, 0, i);
    }
};

///////////////////////////////
/* FUMA TO ACN/N3D CONVERTER */
///////////////////////////////


var fuma2acn = exports.fuma2acn = function fuma2acn(audioCtx, order) {
    (0, _classCallCheck3.default)(this, fuma2acn);


    if (order > 3) {
        console.log("FuMa specifiction is supported up to 3rd order");
        order = 3;
    }

    // re-mapping indices from FuMa channels to ACN
    // var index_fuma2acn = [0, 2, 3, 1, 8, 6, 4, 5, 7, 15, 13, 11, 9, 10, 12, 14];
    // //                    W  Y  Z  X  V  T  R  S  U  Q   O   M   K  L   N   P

    // gains for each FuMa channel to N3D, after re-mapping channels
    var gains_fuma2n3d = [Math.sqrt(2), // W
    Math.sqrt(3), // Y
    Math.sqrt(3), // Z
    Math.sqrt(3), // X
    Math.sqrt(15) / 2, // V
    Math.sqrt(15) / 2, // T
    Math.sqrt(5), // R
    Math.sqrt(15) / 2, // S
    Math.sqrt(15) / 2, // U
    Math.sqrt(35 / 8), // Q
    Math.sqrt(35) / 3, // O
    Math.sqrt(224 / 45), // M
    Math.sqrt(7), // K
    Math.sqrt(224 / 45), // L
    Math.sqrt(35) / 3, // N
    Math.sqrt(35 / 8)]; // P

    this.ctx = audioCtx;
    this.order = order;
    this.nCh = (order + 1) * (order + 1);
    this.in = this.ctx.createChannelSplitter(this.nCh);
    this.out = this.ctx.createChannelMerger(this.nCh);
    this.gains = [];
    this.remapArray = [];

    // get channel remapping values order 0-1
    this.remapArray.push(0, 2, 3, 1); // manually handle until order 1

    // get channel remapping values order 2-N
    if (order > 1) {
        var o = 0;
        var m;
        for (var i = 0; i < this.nCh; i++) {
            m = [];
            if (i >= (o + 1) * (o + 1)) {
                o += 1;
                for (var j = (o + 1) * (o + 1); j < (o + 2) * (o + 2); j++) {
                    if ((j + o % 2) % 2 == 0) {
                        m.push(j);
                    } else {
                        m.unshift(j);
                    }
                }
                this.remapArray = this.remapArray.concat(m);
            }
        }
    }

    // connect inputs/outputs (kept separated for clarity's sake)
    for (var i = 0; i < this.nCh; i++) {
        this.gains[i] = this.ctx.createGain();
        this.gains[i].gain.value = gains_fuma2n3d[i];
        this.in.connect(this.gains[i], this.remapArray[i], 0);
        this.gains[i].connect(this.out, 0, i);
    }
};
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFtYmktY29udmVydGVycy5qcyJdLCJuYW1lcyI6WyJ3eHl6MmFjbiIsImF1ZGlvQ3R4IiwiY3R4IiwiaW4iLCJjcmVhdGVDaGFubmVsU3BsaXR0ZXIiLCJvdXQiLCJjcmVhdGVDaGFubmVsTWVyZ2VyIiwiZ2FpbnMiLCJBcnJheSIsImkiLCJjcmVhdGVHYWluIiwiZ2FpbiIsInZhbHVlIiwiTWF0aCIsIlNRUlQyIiwic3FydCIsImNvbm5lY3QiLCJhY24yd3h5eiIsIlNRUlQxXzIiLCJzbjNkMm4zZCIsIm9yZGVyIiwibkNoIiwibiIsImZsb29yIiwibjNkMnNuM2QiLCJmdW1hMmFjbiIsImNvbnNvbGUiLCJsb2ciLCJnYWluc19mdW1hMm4zZCIsInJlbWFwQXJyYXkiLCJwdXNoIiwibyIsIm0iLCJqIiwidW5zaGlmdCIsImNvbmNhdCJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7OztBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7SUFDYUEsUSxXQUFBQSxRLEdBRVQsa0JBQVlDLFFBQVosRUFBc0I7QUFBQTs7O0FBRWxCLFNBQUtDLEdBQUwsR0FBV0QsUUFBWDtBQUNBLFNBQUtFLEVBQUwsR0FBVSxLQUFLRCxHQUFMLENBQVNFLHFCQUFULENBQStCLENBQS9CLENBQVY7QUFDQSxTQUFLQyxHQUFMLEdBQVcsS0FBS0gsR0FBTCxDQUFTSSxtQkFBVCxDQUE2QixDQUE3QixDQUFYO0FBQ0EsU0FBS0MsS0FBTCxHQUFhLElBQUlDLEtBQUosQ0FBVSxDQUFWLENBQWI7O0FBRUEsU0FBSyxJQUFJQyxJQUFJLENBQWIsRUFBZ0JBLElBQUksQ0FBcEIsRUFBdUJBLEdBQXZCLEVBQTRCO0FBQ3hCLGFBQUtGLEtBQUwsQ0FBV0UsQ0FBWCxJQUFnQixLQUFLUCxHQUFMLENBQVNRLFVBQVQsRUFBaEI7QUFDQSxZQUFJRCxLQUFLLENBQVQsRUFBWSxLQUFLRixLQUFMLENBQVdFLENB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Q0FBM0I7QUFDQSxhQUFLTixFQUFMLENBQVFhLE9BQVIsQ0FBZ0IsS0FBS1QsS0FBTCxDQUFXRSxDQUFYLENBQWhCLEVBQStCLEtBQUtvQixVQUFMLENBQWdCcEIsQ0FBaEIsQ0FBL0IsRUFBbUQsQ0FBbkQ7QUFDQSxhQUFLRixLQUFMLENBQVdFLENBQVgsRUFBY08sT0FBZCxDQUFzQixLQUFLWCxHQUEzQixFQUFnQyxDQUFoQyxFQUFtQ0ksQ0FBbkM7QUFDSDtBQUNKLEMiLCJmaWxlIjoiYW1iaS1jb252ZXJ0ZXJzLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cbi8vICBBcmNob250aXMgUG9saXRpc1xuLy8gIGFyY2hvbnRpcy5wb2xpdGlzQGFhbHRvLmZpXG4vLyAgRGF2aWQgUG9pcmllci1RdWlub3Rcbi8vICBkYXZpcG9pckBpcmNhbS5mclxuLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cbi8vXG4vLyAgSlNBbWJpc29uaWNzIGEgSmF2YVNjcmlwdCBsaWJyYXJ5IGZvciBoaWdoZXItb3JkZXIgQW1iaXNvbmljc1xuLy8gIFRoZSBsaWJyYXJ5IGltcGxlbWVudHMgV2ViIEF1ZGlvIGJsb2NrcyB0aGF0IHBlcmZvcm1cbi8vICB0eXBpY2FsIGFtYmlzb25pYyBwcm9jZXNzaW5nIG9wZXJhdGlvbnMgb24gYXVkaW8gc2lnbmFscy5cbi8vXG4vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xuXG4vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xuLyogRk9BIEItRk9STUFUIFRPIEFDTi9OM0QgQ09OVkVSVEVSICovXG4vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xuZXhwb3J0IGNsYXNzIHd4eXoyYWNuIHtcblxuICAgIGNvbnN0cnVjdG9yKGF1ZGlvQ3R4KSB7XG5cbiAgICAgICAgdGhpcy5jdHggPSBhdWRpb0N0eDtcbiAgICAgICAgdGhpcy5pbiA9IHRoaXMuY3R4LmNyZWF0ZUNoYW5uZWxTcGxpdHRlcig0KTtcbiAgICAgICAgdGhpcy5vdXQgPSB0aGlzLmN0eC5jcmVhdGVDaGFubmVsTWVyZ2VyKDQpO1xuICAgICAgICB0aGlzLmdhaW5zID0gbmV3IEFycmF5KDQpO1xuXG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgNDsgaSsrKSB7XG4gICAgICAgICAgICB0aGlzLmdhaW5zW2ldID0gdGhpcy5jdHguY3JlYXRlR2FpbigpO1xuICAgICAgICAgICAgaWYgKGkgPT0gMCkgdGhpcy5nYWluc1tpXS5nYWluLnZhbHVlID0gTWF0aC5TUVJUMjtcbiAgICAgICAgICAgIGVsc2UgdGhpcy5nYWluc1tpXS5nYWluLnZhbHVlID0gTWF0aC5zcXJ0KDMpO1xuXG4gICAgICAgICAgICB0aGlzLmdhaW5zW2ldLmNvbm5lY3QodGhpcy5vdXQsIDAsIGkpO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuaW4uY29ubmVjdCh0aGlzLmdhaW5zWzBdLCAwLCAwKTtcbiAgICAgICAgdGhpcy5pbi5jb25uZWN0KHRoaXMuZ2FpbnNbM10sIDEsIDApO1xuICAgICAgICB0aGlzLmluLmNvbm5lY3QodGhpcy5nYWluc1sxXSwgMiwgMCk7XG4gICAgICAgIHRoaXMuaW4uY29ubmVjdCh0aGlzLmdhaW5zWzJdLCAzLCAwKTtcbiAgICB9XG59XG5cbi8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXG4vKiBBQ04vTjNEIFRPIEZPQSBCLUZPUk1BVCBDT05WRVJURVIgKi9cbi8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXG5leHBvcnQgY2xhc3MgYWNuMnd4eXoge1xuXG4gICAgY29uc3RydWN0b3IoYXVkaW9DdHgpIHtcblxuICAgICAgICB0aGlzLmN0eCA9IGF1ZGlvQ3R4O1xuICAgICAgICB0aGlzLmluID0gdGhpcy5jdHguY3JlYXRlQ2hhbm5lbFNwbGl0dGVyKDQpO1xuICAgICAgICB0aGlzLm91dCA9IHRoaXMuY3R4LmNyZWF0ZUNoYW5uZWxNZXJnZXIoNCk7XG4gICAgICAgIHRoaXMuZ2FpbnMgPSBuZXcgQXJyYXkoNCk7XG5cbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCA0OyBpKyspIHtcbiAgICAgICAgICAgIHRoaXMuZ2FpbnNbaV0gPSB0aGlzLmN0eC5jcmVhdGVHYWluKCk7XG4gICAgICAgICAgICBpZiAoaSA9PSAwKSB0aGlzLmdhaW5zW2ldLmdhaW4udmFsdWUgPSBNYXRoLlNRUlQxXzI7XG4gICAgICAgICAgICBlbHNlIHRoaXMuZ2FpbnNbaV0uZ2Fpbi52YWx1ZSA9IDEgLyBNYXRoLnNxcnQoMyk7XG5cbiAgICAgICAgICAgIHRoaXMuZ2FpbnNbaV0uY29ubmVjdCh0aGlzLm91dCwgMCwgaSk7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5pbi5jb25uZWN0KHRoaXMuZ2FpbnNbMF0sIDAsIDApO1xuICAgICAgICB0aGlzLmluLmNvbm5lY3QodGhpcy5nYWluc1syXSwgMSwgMCk7XG4gICAgICAgIHRoaXMuaW4uY29ubmVjdCh0aGlzLmdhaW5zWzNdLCAyLCAwKTtcbiAgICAgICAgdGhpcy5pbi5jb25uZWN0KHRoaXMuZ2FpbnNbMV0sIDMsIDApO1xuICAgIH1cbn1cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xuLyogQUNOL1NOM0QgVE8gQUNOL04zRCBDT05WRVJURVIgKi9cbi8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXG5leHBvcnQgY2xhc3Mgc24zZDJuM2Qge1xuICAgIFxuICAgIGNvbnN0cnVjdG9yKGF1ZGlvQ3R4LCBvcmRlcikge1xuICAgICAgICBcbiAgICAgICAgdGhpcy5jdHggPSBhdWRpb0N0eDtcbiAgICAgICAgdGhpcy5vcmRlciA9IG9yZGVyO1xuICAgICAgICB0aGlzLm5DaCA9IChvcmRlciArIDEpICogKG9yZGVyICsgMSk7XG4gICAgICAgIHRoaXMuaW4gPSB0aGlzLmN0eC5jcmVhdGVDaGFubmVsU3BsaXR0ZXIodGhpcy5uQ2gpO1xuICAgICAgICB0aGlzLm91dCA9IHRoaXMuY3R4LmNyZWF0ZUNoYW5uZWxNZXJnZXIodGhpcy5uQ2gpO1xuICAgICAgICB0aGlzLmdhaW5zID0gbmV3IEFycmF5KHRoaXMubkNoKTtcbiAgICAgICAgXG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgdGhpcy5uQ2g7IGkrKykge1xuICAgICAgICAgICAgdmFyIG4gPSBNYXRoLmZsb29yKE1hdGguc3FydChpKSk7XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIHRoaXMuZ2FpbnNbaV0gPSB0aGlzLmN0eC5jcmVhdGVHYWluKCk7XG4gICAgICAgICAgICB0aGlzLmdhaW5zW2ldLmdhaW4udmFsdWUgPSBNYXRoLnNxcnQoMipuKzEpO1xuICAgICAgICAgICAgXG4gICAgICAgICAgICB0aGlzLmluLmNvbm5lY3QodGhpcy5nYWluc1tpXSwgaSwgMCk7XG4gICAgICAgICAgICB0aGlzLmdhaW5zW2ldLmNvbm5lY3QodGhpcy5vdXQsIDAsIGkpO1xuICAgICAgICB9XG4gICAgfVxufVxuXG4vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xuLyogQUNOL04zRCBUTyBBQ04vU04zRCBDT05WRVJURVIgKi9cbi8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXG5leHBvcnQgY2xhc3MgbjNkMnNuM2Qge1xuICAgIFxuICAgIGNvbnN0cnVjdG9yKGF1ZGlvQ3R4LCBvcmRlcikge1xuICAgICAgICBcbiAgICAgICAgdGhpcy5jdHggPSBhdWRpb0N0eDtcbiAgICAgICAgdGhpcy5vcmRlciA9IG9yZGVyO1xuICAgICAgICB0aGlzLm5DaCA9IChvcmRlciArIDEpICogKG9yZGVyICsgMSk7XG4gICAgICAgIHRoaXMuaW4gPSB0aGlzLmN0eC5jcmVhdGVDaGFubmVsU3BsaXR0ZXIodGhpcy5uQ2gpO1xuICAgICAgICB0aGlzLm91dCA9IHRoaXMuY3R4LmNyZWF0ZUNoYW5uZWxNZXJnZXIodGhpcy5uQ2gpO1xuICAgICAgICB0aGlzLmdhaW5zID0gbmV3IEFycmF5KHRoaXMubkNoKTtcbiAgICAgICAgXG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgdGhpcy5uQ2g7IGkrKykge1xuICAgICAgICAgICAgdmFyIG4gPSBNYXRoLmZsb29yKE1hdGguc3FydChpKSk7XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIHRoaXMuZ2FpbnNbaV0gPSB0aGlzLmN0eC5jcmVhdGVHYWluKCk7XG4gICAgICAgICAgICB0aGlzLmdhaW5zW2ldLmdhaW4udmFsdWUgPSAxL01hdGguc3FydCgyKm4rMSk7XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIHRoaXMuaW4uY29ubmVjdCh0aGlzLmdhaW5zW2ldLCBpLCAwKTtcbiAgICAgICAgICAgIHRoaXMuZ2FpbnNbaV0uY29ubmVjdCh0aGlzLm91dCwgMCwgaSk7XG4gICAgICAgIH1cbiAgICB9XG59XG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xuLyogRlVNQSBUTyBBQ04vTjNEIENPTlZFUlRFUiAqL1xuLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xuZXhwb3J0IGNsYXNzIGZ1bWEyYWNuIHtcblxuICAgIGNvbnN0cnVjdG9yKGF1ZGlvQ3R4LCBvcmRlcikge1xuICAgICAgICBcbiAgICAgICAgaWYgKG9yZGVyPjMpIHtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiRnVNYSBzcGVjaWZpY3Rpb24gaXMgc3VwcG9ydGVkIHVwIHRvIDNyZCBvcmRlclwiKTtcbiAgICAgICAgICAgIG9yZGVyID0gMztcbiAgICAgICAgfVxuICAgICAgICBcbiAgICAgICAgLy8gcmUtbWFwcGluZyBpbmRpY2VzIGZyb20gRnVNYSBjaGFubmVscyB0byBBQ05cbiAgICAgICAgLy8gdmFyIGluZGV4X2Z1bWEyYWNuID0gWzAsIDIsIDMsIDEsIDgsIDYsIDQsIDUsIDcsIDE1LCAxMywgMTEsIDksIDEwLCAxMiwgMTRdO1xuICAgICAgICAvLyAvLyAgICAgICAgICAgICAgICAgICAgVyAgWSAgWiAgWCAgViAgVCAgUiAgUyAgVSAgUSAgIE8gICBNICAgSyAgTCAgIE4gICBQXG4gICAgICAgIFxuICAgICAgICAvLyBnYWlucyBmb3IgZWFjaCBGdU1hIGNoYW5uZWwgdG8gTjNELCBhZnRlciByZS1tYXBwaW5nIGNoYW5uZWxzXG4gICAgICAgIHZhciBnYWluc19mdW1hMm4zZCA9IFtNYXRoLnNxcnQoMiksICAgICAvLyBXXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICBNYXRoLnNxcnQoMyksICAgICAvLyBZXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICBNYXRoLnNxcnQoMyksICAgICAvLyBaXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICBNYXRoLnNxcnQoMyksICAgICAvLyBYXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICBNYXRoLnNxcnQoMTUpLzIsICAvLyBWXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICBNYXRoLnNxcnQoMTUpLzIsICAvLyBUXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICBNYXRoLnNxcnQoNSksICAgICAvLyBSXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICBNYXRoLnNxcnQoMTUpLzIsICAvLyBTXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICBNYXRoLnNxcnQoMTUpLzIsICAvLyBVXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICBNYXRoLnNxcnQoMzUvOCksICAvLyBRXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICBNYXRoLnNxcnQoMzUpLzMsICAvLyBPXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICBNYXRoLnNxcnQoMjI0LzQ1KSwvLyBNXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICBNYXRoLnNxcnQoNyksICAgICAvLyBLXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICBNYXRoLnNxcnQoMjI0LzQ1KSwvLyBMXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICBNYXRoLnNxcnQoMzUpLzMsICAvLyBOXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICBNYXRoLnNxcnQoMzUvOCldICAvLyBQXG4gICAgICAgIFxuICAgICAgICB0aGlzLmN0eCA9IGF1ZGlvQ3R4O1xuICAgICAgICB0aGlzLm9yZGVyID0gb3JkZXI7XG4gICAgICAgIHRoaXMubkNoID0gKG9yZGVyICsgMSkgKiAob3JkZXIgKyAxKTtcbiAgICAgICAgdGhpcy5pbiA9IHRoaXMuY3R4LmNyZWF0ZUNoYW5uZWxTcGxpdHRlcih0aGlzLm5DaCk7XG4gICAgICAgIHRoaXMub3V0ID0gdGhpcy5jdHguY3JlYXRlQ2hhbm5lbE1lcmdlcih0aGlzLm5DaCk7XG4gICAgICAgIHRoaXMuZ2FpbnMgPSBbXTtcbiAgICAgICAgdGhpcy5yZW1hcEFycmF5ID0gW107XG5cbiAgICAgICAgLy8gZ2V0IGNoYW5uZWwgcmVtYXBwaW5nIHZhbHVlcyBvcmRlciAwLTFcbiAgICAgICAgdGhpcy5yZW1hcEFycmF5LnB1c2goMCwgMiwgMywgMSk7IC8vIG1hbnVhbGx5IGhhbmRsZSB1bnRpbCBvcmRlciAxXG5cbiAgICAgICAgLy8gZ2V0IGNoYW5uZWwgcmVtYXBwaW5nIHZhbHVlcyBvcmRlciAyLU5cbiAgICAgICAgaWYgKG9yZGVyPjEpIHtcbiAgICAgICAgICAgIHZhciBvID0gMDtcbiAgICAgICAgICAgIHZhciBtO1xuICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCB0aGlzLm5DaDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgbSA9IFtdO1xuICAgICAgICAgICAgICAgIGlmIChpID49IChvICsgMSkgKiAobyArIDEpKSB7XG4gICAgICAgICAgICAgICAgICAgIG8gKz0gMTtcbiAgICAgICAgICAgICAgICAgICAgZm9yICh2YXIgaiA9IChvICsgMSkgKiAobyArIDEpOyBqIDwgKG8gKyAyKSAqIChvICsgMik7IGorKykge1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCgoaiArIG8gJSAyKSAlIDIpID09IDApIHsgbS5wdXNoKGopIH0gZWxzZSB7IG0udW5zaGlmdChqKSB9XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgdGhpcy5yZW1hcEFycmF5ID0gdGhpcy5yZW1hcEFycmF5LmNvbmNhdChtKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICAvLyBjb25uZWN0IGlucHV0cy9vdXRwdXRzIChrZXB0IHNlcGFyYXRlZCBmb3IgY2xhcml0eSdzIHNha2UpXG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgdGhpcy5uQ2g7IGkrKykge1xuICAgICAgICAgICAgdGhpcy5nYWluc1tpXSA9IHRoaXMuY3R4LmNyZWF0ZUdhaW4oKTtcbiAgICAgICAgICAgIHRoaXMuZ2FpbnNbaV0uZ2Fpbi52YWx1ZSA9IGdhaW5zX2Z1bWEybjNkW2ldO1xuICAgICAgICAgICAgdGhpcy5pbi5jb25uZWN0KHRoaXMuZ2FpbnNbaV0sIHRoaXMucmVtYXBBcnJheVtpXSwgMCk7XG4gICAgICAgICAgICB0aGlzLmdhaW5zW2ldLmNvbm5lY3QodGhpcy5vdXQsIDAsIGkpO1xuICAgICAgICB9XG4gICAgfVxufVxuIl19