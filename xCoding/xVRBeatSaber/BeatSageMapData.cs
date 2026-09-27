using System;
using UnityEngine;

// Beat Sage JSON 데이터를 파싱하기 위한 클래스 구조
[Serializable]
public class BeatSageMapData {
    public string _version;
    public BeatSageNote[] _notes; // 노트(블록) 배열
}

[Serializable]
public class BeatSageNote {
    public float _time;          // 노트가 등장할 비트(Beat) 시간
    public int _lineIndex;       // 가로 위치 (0 ~ 3번 라인)
    public int _lineLayer;       // 세로 위치 (0 ~ 2번 높이)
    public int _type;            // 노트 종류 (0: 왼쪽/빨간색, 1: 오른쪽/파란색, 3: 폭탄)
    public int _cutDirection;    // 베는 방향 (0: 위, 1: 아래, 2: 왼쪽, 3: 오른쪽 등)
}
