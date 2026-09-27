using UnityEngine;
using BlackMassSoftware.FloatingTextEngine.Lite;
using BlackMassSoftware.FloatingTextEngine.Lite.Behaviors;

public class CoinScoreEffect : MonoBehaviour {
    [Header("Floating Text")]
    public Vector3 textOffset = new Vector3(0f, 0.8f, 0f); // 텍스트가 생성될 위치 오프셋
    public Color textColor = Color.yellow;

    [Header("Effect")]
    public float popScale = 1.4f; // 텍스트가 팝업될 때의 스케일
    public float moveUpDistance = 1.2f; // 텍스트가 펍하면서 위로 이동할 거리
    public float effectDuration = 0.6f; // 텍스트가 나타나고 사라지는 전체 지속 시간

    public void Play(int scoreAmount) {
        Vector3 spawnPosition = transform.position + textOffset; // 텍스트가 생성될 위치를 계산 (현재 오브젝트의 위치 + 오프셋)

        FloatingTextEngine
            .CreateTextAtWorldSpace(spawnPosition, "+" + scoreAmount, textColor)
            .With(FloatingTextBehaviors.Pop(popScale, 0.08f, 0.15f))
            .With(FloatingTextBehaviors.MoveUp(moveUpDistance, effectDuration))
            .With(FloatingTextBehaviors.FadeOut(effectDuration));
    }
}
